# Auten for Claude Code

Auten gives Claude Code hands on a real screen. It clicks, types and reads the screen on your
Mac, Windows or Linux computer, and on your Android phone over USB (beta), so Claude can work in
apps that have no API: desktop programs, admin panels, supplier portals, mobile apps.

Claude stays the brain and decides the steps. Auten is a small runner on your computer that does
the clicking and reads the interface through the accessibility tree, so Claude gets a numbered
list of real buttons and fields instead of guessing coordinates. Screenshots and OCR are there for
apps without accessibility info.

## What this plugin adds

One local MCP server, `auten`, started with `npx -y @autenai/mcp@0.1.2`. The package is a thin
launcher (source in this repository, `bin/auten-mcp.js`): if the Auten runner is installed it hands
the connection to `auten mcp-bridge`; if not, it offers a single `install_auten` tool that tells
Claude the one-line install command. The plugin has no skills, hooks or commands.

## Setup

1. Install the plugin: `/plugin marketplace add auten-ai/auten-mcp`, then `/plugin install auten@auten`.
2. Install the runner once (no admin rights), then restart Claude Code:
   - macOS and Linux: `curl -fsSL https://auten.ai/install | bash`
   - Windows (PowerShell): `irm https://auten.ai/install.ps1 | iex`
3. The first run asks you to connect a free Auten key: 30 minutes of runtime every month, no card.

Then ask in plain words, for example "Export the report from that desktop app as CSV" or
"Fill these three contacts into the CRM form". When a task worked, ask Claude to save it as a
skill; the next run replays it in seconds without calling the model.

## What it runs and sends

- The launcher runs only the installed `auten` runner on your machine. It downloads nothing else.
- Auten has no model of its own and never needs your AI key. Claude keeps using your plan.
- Saved passwords stay on your computer: `fill_login` types them locally and Claude never sees the value.
- Runtime is counted against your Auten key on auten.ai (free plan 30 minutes a month).
- When three different users learn the same task, it can become a shared skill: only the steps
  travel, never screen content or passwords.

The Auten runner is not open source. This repository holds the launcher and documentation only.

## Links

- Website: https://auten.ai/mcp
- Setup for every client: https://auten.ai/connect
- Questions: https://github.com/auten-ai/auten-mcp/discussions
- Contact: hello@auten.ai
