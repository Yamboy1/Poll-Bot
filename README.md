# Poll Bot

A new revolutionary discord bot for running polls, implemented through (dynamically generated) slash commands.

NOTE: Because this bot runs on webhooks, you need to have an open port on a publicly facing ip for discord to communicate with the bot.

## Setup and running the bot

- Install dependencies: `yarn`
- Create config.json based off this example: 
```json
{
  "applicationID": "",
  "publicKey": "",
  "token": "",
  "serverPort": 8080
}
```

- Generate Prisma Client: `yarn prisma generate`
- Compile typescript: `tsc -p tsconfig.json` (this will also copy the config.json to the lib folder, so this MUST be done after the config.json step- 
- Run the node application: `node lib/src/index.js`
- Add the interactions url (`https://YOUR-DOMAIN-HERE.com/interactions`) to the discord developer portal for your application. You should only need to do this once

## FAQ

- I don't have an open port, or I don't have a publicly facing IP address?

You can use a tunnelling program such as ngrok to open a port when you odn't have a publicly facing IP address

