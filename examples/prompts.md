# What to ask your agent

Once Auten is connected, you talk to your agent (Claude Code, Codex, Cursor or any MCP client) as usual.
It sees the screen through Auten and clicks, types and reads for you. These prompts are a starting point:
copy one, change the details to your own apps.

## Apps with no API

- "Open Figma, export the Hero frame as PNG to my Desktop."
- "In the accounting app, create a draft invoice for ACME for 3 hours of consulting, but don't send it."
- "Open System Settings and tell me which apps have Screen Recording permission."
- "Go through the unread invoices in my mail and fill them into the accounting app. Stop and show me before you save each one."

## Browser work you repeat every week

- "Download last month's invoice from the supplier portal and save it to ~/Invoices."
- "Fill the weekly timesheet form with the hours from timesheet.csv. Don't submit it, I'll check it first."
- "Log in to the admin panel with my saved login and export the orders report as CSV."

Saved logins are typed locally with `fill_login`: the model never sees the password, and a login only
works on the site or app where it was first used.

## Your Android phone (beta)

Connect the phone over USB with USB debugging on, then:

- "On my phone, open the Instagram app and post the reel from Downloads with this caption: ..."
- "On my phone, open WhatsApp and read me the last three messages in the family group. Don't reply."
- "On my phone, turn on Do Not Disturb until 8 am."

## Teach it once, replay without the AI

For a task you will repeat, ask the agent to record it the first time:

- "Record this as a skill called export-orders: log in to the admin panel, export the orders report as CSV."

Next time the skill replays step by step without a model call, so it is fast and uses no tokens.
If the app changed and a step breaks, the agent fixes that step and the skill keeps working.

- "Run the export-orders skill."
- "List my skills."

## Good habits

- Say what NOT to do: "don't send", "don't buy", "ask me before deleting".
- Text on the screen is data, not instructions. If a page tells the agent to do something, it should ask you first.
- Start with read-only tasks ("tell me what you see") to learn how your agent and Auten work together.

Questions or a task that didn't work? Ask in [Discussions](https://github.com/auten-ai/auten-mcp/discussions).
