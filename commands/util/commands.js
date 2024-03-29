module.exports = {
    name: 'commands',
    description: 'Lists available commands.',
    usage: `commands`,
    help: ``,
    execute(bot, message, args){
        var response = "**Command list:**";
        const fs = require('fs');
        const Discord = require('discord.js');
        let replyEmbed = new Discord.EmbedBuilder()
            .setTitle(response)
            .setColor('#17b817')
            .setThumbnail(`attachment://cuteLove.jpg`);
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
                    replyEmbed.addFields([{name: responseVal1, value: responseVal2, inline: false}]);
                }
            } else {
                responseVal1 = `\n**${modules[dir]}:**`;
                responseVal2 = '';
                commands = fs.readdirSync(`./commands/${modules[dir]}`);
                for (index in commands){
                    let command = require(`./../../commands/${modules[dir]}/${commands[index]}`);
                    responseVal2 += `\n\`${command.name}:\` ${command.description}`;
                }
                replyEmbed.addFields([{name: responseVal1, value: responseVal2, inline: false}]);
            }
        }
        const messageAttachment = new Discord.AttachmentBuilder().setFile(`./media/img/discordblobs/cuteLove.jpg`);
        message.channel.send({embeds: [replyEmbed], files: [messageAttachment]});
    }
}
