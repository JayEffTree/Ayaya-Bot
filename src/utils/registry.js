
const path = require('path');
const fs = require('fs').promises;
const BaseCommand = require('./structures/BaseCommand');
const BaseEvent = require('./structures/BaseEvent');

async function registerCommands(client, dir = '') {
  const filePath = path.join(__dirname, dir);
  const files = await fs.readdir(filePath);
  for (const file of files) {
    const stat = await fs.lstat(path.join(filePath, file));
    if (stat.isDirectory()) registerCommands(client, path.join(dir, file));
    if (file.endsWith('.js')) {
      const Command = require(path.join(filePath, file));
      if (Command.prototype instanceof BaseCommand) {
        const cmd = new Command();
        client.commands.set(cmd.name, cmd);
        console.log(`[INFO] Loaded - [${cmd.name} - ${cmd.description}]`)
        cmd.aliases.forEach(async (alias) => {
          client.commands.set(alias, cmd);
          console.log(`[INFO] Loaded alias - [${alias}]`)
        });
      }
    }
  }
}

async function reloadCommands(client, dir = '../commands') {
  const filePath = path.join(__dirname, dir);
  const files = await fs.readdir(filePath);

  for (const file of files) {
    const stat = await fs.lstat(path.join(filePath, file));
    if (stat.isDirectory()) reloadCommands(client, path.join(dir, file));
    if (file.endsWith('.js')) {
      delete require.cache[require.resolve(path.join(filePath, file))]
      const Command = require(path.join(filePath, file));
      if (Command.prototype instanceof BaseCommand) {
        const cmd = new Command();
        await client.commands.set(cmd.name, cmd);
        console.log(`[INFO] Reloaded - [${cmd.name}]`)
        cmd.aliases.forEach(async (alias) => {
          delete require.cache[require.resolve(path.join(filePath, file))]
          await client.commands.set(alias, cmd);
          console.log(`[INFO] Reloaded alias - [${alias}]`)
        });
      }
    }
  }
}

async function registerEvents(client, dir = '') {
  const filePath = path.join(__dirname, dir);
  const files = await fs.readdir(filePath);
  for (const file of files) {
    const stat = await fs.lstat(path.join(filePath, file));
    if (stat.isDirectory()) registerEvents(client, path.join(dir, file));
    if (file.endsWith('.js')) {
      const Event = require(path.join(filePath, file));
      if (Event.prototype instanceof BaseEvent) {
        const event = new Event();
        client.events.set(event.name, event);
        client.on(event.name, event.run.bind(event, client));
      }
    }
  }
}

module.exports = { 
  registerCommands, 
  registerEvents,
  reloadCommands,
};