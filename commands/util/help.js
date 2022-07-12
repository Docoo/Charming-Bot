module.exports = {
    name: 'help',
    description: 'Gives help for a certain command',
    usage: `help <command>`,
    help: `**command** : any command you can use
            \tfind a complete list using the 'commands' command`,
    execute(bot, message, args){
        const Discord = require('discord.js');
        let command = args[0];
        if (command == undefined) command = "help";
        if (bot.commands.has(command)){
            command = bot.commands.get(command);
            let helpVal = command.help;
            if (helpVal == '') helpVal = '-';
            let newEmbed = new Discord.MessageEmbed()
                .setTitle(`Help for ${command.name}`)
                .addField(`${command.description} `, 'Usage: ', false)
                .addField(`${command.usage}`, helpVal, false)
                .setThumbnail('attachment://help.png');
            const messageAttachment = new Discord.MessageAttachment().setFile('./assets/help.png')
            return message.channel.send({embeds: [newEmbed], files: [messageAttachment]});
        } else {
            return message.channel.send("Command not found!");
        }
    }
}