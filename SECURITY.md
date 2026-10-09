# Security

## Reporting a vulnerability

Please email **hello@auten.ai** with the details and steps to reproduce. Do not open a public
issue for security reports. We will reply as soon as we can and keep you updated until it is fixed.

## What this repository contains

This repository holds only the thin `@autenai/mcp` launcher (`bin/auten-mcp.js`), the README and
listing metadata. The launcher starts the Auten runner on your computer; the runner itself is not
open source.

## How Auten handles your machine

- The runner only acts when your MCP client calls a tool. Nothing runs in the background on its own.
- Stored passwords live in the system keychain (macOS, Windows) or a private local vault (Linux)
  and never reach our servers or the model. A secret that shows up on screen is replaced with a
  placeholder before your agent sees it.
- Each saved login is pinned to the site or app where it was first used. On any other origin
  `fill_login` refuses and types nothing; only you can re-pin it (`auten vault unpin <name>`).
- Your activity history and learned skills are written to your own computer, not ours.

See the [privacy policy](https://auten.ai/privacy).
