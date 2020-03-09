module.exports = {
    name: 'commands',
    description: 'Lists available commands.',
    usage: `commands`,
    help: ``,
    execute(bot, message, args){
        var response = "**Command list:**";
        const fs = require('fs');
        const Discord = require('discord.js');
        let replyEmbed = new Discord.RichEmbed()
            .setTitle(response)
            .setColor('#17b817')
            .addBlankField(false)
            .attachFile('./media/img/discordblobs/cuteLove.jpg')
            .setThumbnail('attachment://cuteLove.jpg');
        let onemodule = false;
        if (args[0] != undefined && args[0] != null){
            onemodule = true;
        }
        modules = fs.readdirSync('./commands');
        for (dir in modules){
            if (onemodule){
                if (modules[dir] == args[0]){
                    responseVal1 = `\n**${modules[dir]}:**`;
                    responseVal2 = '';
                    commands = fs.readdirSync(`./commands/${modules[dir]}`);
                    for (index in commands){
                        let command = require(`./../../commands/${modules[dir]}/${commands[index]}`);
                        responseVal2 += `\n\`${command.name}:\` ${command.description}`;
                    }
                    replyEmbed.addField(responseVal1, responseVal2, false);
                }
            } else {
                responseVal1 = `\n**${modules[dir]}:**`;
                responseVal2 = '';
                commands = fs.readdirSync(`./commands/${modules[dir]}`);
                for (index in commands){
                    let command = require(`./../../commands/${modules[dir]}/${commands[index]}`);
                    responseVal2 += `\n\`${command.name}:\` ${command.description}`;
                }
                replyEmbed.addField(responseVal1, responseVal2, false);
            }
        }
        message.channel.send(replyEmbed);
    }
}
