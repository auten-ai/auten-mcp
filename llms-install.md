# Installing Auten for an AI agent (Cline and other MCP clients)

These are step-by-step instructions for an AI agent that is setting up Auten for its user.
Auten gives the agent hands on a real screen: the user's computer (macOS, Windows 10/11, Linux X11)
and, in beta, an Android phone over USB.

Auten has two parts:

- the **runner**, installed once per computer with a one-line installer (no admin rights);
- this MCP server entry, which starts `auten mcp-bridge` over stdio.

## Step 1: install the runner

Run the installer in a terminal. Set `AUTEN_NO_LAUNCH=1` on macOS and Linux: without it the
installer starts Auten's interactive first run right away, which waits for keyboard input and
will look stuck inside an agent's terminal.

macOS and Linux:

```bash
curl -fsSL https://auten.ai/install | AUTEN_NO_LAUNCH=1 bash
```

Windows (PowerShell):

```powershell
irm https://auten.ai/install.ps1 | iex
```

The installer is a plain script. If the user wants to read it first, show it with
`curl -fsSL https://auten.ai/install` (or open https://auten.ai/install.ps1 on Windows).

The command lands in `~/.local/bin/auten` (macOS/Linux). If `auten` is not found afterwards,
use the full path or run `export PATH="$HOME/.local/bin:$PATH"`.

## Step 2: the user connects a key

This step needs the user, not the agent. Ask them to run this in their own terminal:

```bash
auten login
```

The free plan gives 30 minutes of runtime every month and needs no card. On macOS Auten also
needs Accessibility and Screen Recording permission, which only the user can grant:
`auten setup` opens the system prompts.
`auten status` shows what is connected and what is still missing.

## Step 3: add the MCP server

Add this to `cline_mcp_settings.json` (Cline: MCP Servers, Configure):

```json
{
  "mcpServers": {
    "auten": {
      "command": "auten",
      "args": ["mcp-bridge"]
    }
  }
}
```

If the client cannot find `auten`, use the absolute path from `which auten`
(usually `/Users/<name>/.local/bin/auten` or `/home/<name>/.local/bin/auten`).

Alternative that works in any client able to start an npm package (Node.js 18+). It starts the
installed runner, and if the runner is missing it tells the agent how to install it:

```json
{
  "mcpServers": {
    "auten": {
      "command": "npx",
      "args": ["-y", "@autenai/mcp"]
    }
  }
}
```

## Step 4: check that it works

Restart the MCP server, then call the `list_elements` tool. It should return the frontmost app,
numbered on-screen elements and the window's visible text. A good first request from the user:
"Open my calendar and tell me what is next."

## Troubleshooting

- `auten: command not found` in the client: use the absolute path (Step 3).
- Tools say the key is missing or the runtime is used up: the user runs `auten login` or checks
  their plan at https://auten.ai/account.
- macOS clicks do nothing: Accessibility or Screen Recording permission was not granted to the
  terminal or app that starts Auten. The user runs `auten setup` again, or grants it in
  System Settings, Privacy & Security.
- Stop everything Auten started: `auten stop`.

More: [README](README.md), https://auten.ai/mcp, questions to hello@auten.ai.
