#!/usr/bin/env node
// Auten MCP launcher.
// If the Auten runner is installed, hand stdio over to `auten mcp-bridge`.
// If it is not, speak just enough MCP to tell the agent how to install it.
import { spawn } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { homedir, platform } from "node:os";
import { delimiter, join } from "node:path";
import { createInterface } from "node:readline";

const IS_WIN = platform() === "win32";
const PKG = JSON.parse(readFileSync(new URL("../package.json", import.meta.url), "utf8"));

function findAuten() {
  const fromEnv = process.env.AUTEN_BIN;
  if (fromEnv && existsSync(fromEnv)) return fromEnv;
  const names = IS_WIN ? ["auten.cmd", "auten.exe", "auten.bat"] : ["auten"];
  for (const dir of (process.env.PATH || "").split(delimiter)) {
    if (!dir) continue;
    for (const n of names) {
      const p = join(dir, n);
      if (existsSync(p)) return p;
    }
  }
  const known = IS_WIN
    ? [join(process.env.LOCALAPPDATA || join(homedir(), "AppData", "Local"), "auten", "bin", "auten.cmd")]
    : [join(homedir(), ".local", "bin", "auten")];
  return known.find((p) => existsSync(p)) || null;
}

const bin = findAuten();

if (bin) {
  const child = spawn(bin, ["mcp-bridge", ...process.argv.slice(2)], {
    stdio: "inherit",
    shell: IS_WIN && /\.(cmd|bat)$/i.test(bin),
  });
  for (const sig of ["SIGINT", "SIGTERM", "SIGHUP"]) {
    process.on(sig, () => child.kill(sig));
  }
  child.on("exit", (code, signal) => process.exit(signal ? 1 : code ?? 0));
  child.on("error", (err) => {
    process.stderr.write(`auten-mcp: could not start ${bin}: ${err.message}\n`);
    process.exit(1);
  });
} else {
  serveSetupOnly();
}

function installText() {
  const cmd = IS_WIN
    ? "irm https://auten.ai/install.ps1 | iex"
    : "curl -fsSL https://auten.ai/install | bash";
  const shell = IS_WIN ? "PowerShell" : "a terminal";
  return [
    "Auten is not installed on this computer yet, so its tools are not available.",
    "",
    `Install the runner by running this in ${shell} (no admin rights needed):`,
    "",
    `    ${cmd}`,
    "",
    "The first run asks for a free key (30 minutes every month, no card).",
    "Then restart your MCP client. This server will start Auten automatically",
    "and you get the full tool set: list_elements, click_at, fill, read_text,",
    "screenshot, open_app, run_skill and more.",
    "",
    "Setup for every client: https://auten.ai/connect",
  ].join("\n");
}

function serveSetupOnly() {
  const send = (msg) => process.stdout.write(JSON.stringify(msg) + "\n");
  const tool = {
    name: "install_auten",
    description:
      "Auten (computer use for your AI agent) is not installed on this machine yet. " +
      "Call this to get the one-line install command for this OS and the next steps.",
    inputSchema: { type: "object", properties: {}, additionalProperties: false },
  };
  const rl = createInterface({ input: process.stdin });
  rl.on("line", (line) => {
    let req;
    try {
      req = JSON.parse(line);
    } catch {
      return;
    }
    if (req.id === undefined) return; // notification
    const ok = (result) => send({ jsonrpc: "2.0", id: req.id, result });
    switch (req.method) {
      case "initialize":
        return ok({
          protocolVersion: req.params?.protocolVersion || "2025-06-18",
          capabilities: { tools: {} },
          serverInfo: { name: "auten", version: PKG.version },
          instructions: installText(),
        });
      case "ping":
        return ok({});
      case "tools/list":
        return ok({ tools: [tool] });
      case "tools/call":
        if (req.params?.name === tool.name) {
          return ok({ content: [{ type: "text", text: installText() }] });
        }
        return send({ jsonrpc: "2.0", id: req.id, error: { code: -32602, message: `Unknown tool: ${req.params?.name}` } });
      default:
        return send({ jsonrpc: "2.0", id: req.id, error: { code: -32601, message: `Method not found: ${req.method}` } });
    }
  });
  rl.on("close", () => process.exit(0));
}
