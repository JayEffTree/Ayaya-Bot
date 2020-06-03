require('dotenv').config();
const { Client } = require('discord.js');
const { registerCommands, registerEvents } = require('./utils/registry');
const client = new Client();

(async () => {
  client.commands = new Map();
  client.commands.alias = new Map(); //setup new map for aliases specifically
  client.events = new Map();
  client.resource = require('./utils/embeds');
  client.prefix = process.env.DISCORD_BOT_PREFIX;
  await registerCommands(client, '../commands');
  await registerEvents(client, '../events');
  await client.login(process.env.DISCORD_BOT_TOKEN);
  //client.music.on("nodeConnect", node => console.log("[READY] Connected to LavaLink Server"));
})();