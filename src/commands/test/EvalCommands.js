const BaseCommand = require('../../utils/structures/BaseCommand');
const util = require('util')
const Discord = require('discord.js')
module.exports = class PingCommand extends BaseCommand {
  constructor() {
    super('eval', 'Eval javascript code as client', []);
  }

  async run(client, message, args) {
    //send loading embed
    if(message.author.id !== process.env.DISCORD_BOT_OWNER) return console.log(`[WARN] - Unauthorized eval used by user: (User Tag: ${message.author.tag} - Guild ID: ${message.guild.id})`);
    let code = args.join(" ");
    if (!code) return;

    try {
        let evaled = clean(await eval(code)), output = `📤 Output`;
        if (evaled.length > 800) evaled = evaled.substring(0, 800) + `...`;

        return message.channel.send(
            client.resource.embed()
            .addField(`📥 Input`, `\`\`\`\n${code}\n\`\`\``)
            .addField(output, `\`\`\`js\n${evaled}\n\`\`\``)
            .addField(`Status`, `Success`)
        );
    }
    catch (e) {
        return message.channel.send(client.resource.embed()
            .addField(`📥 Input`, `\`\`\`\n${code}\n\`\`\``)
            .addField(`📤 Output`, `\`\`\`js\n${e}\n\`\`\``)
            .addField(`Status`, `Failed`)
        );
    }
    
    function clean(text) {
        if (typeof text !== `string`)
            text = require(`util`).inspect(text)
        let rege = new RegExp(process.env.DISCORD_BOT_TOKEN, "gi");
        if(text == process.env.DISCORD_BOT_TOKEN) return text = "Here is your token: ||[REDACTED]||"
        return text;
    }
  }
}