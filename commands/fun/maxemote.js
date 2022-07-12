module.exports = {
    name: 'maxemote',
    description: 'Finds and posts an embed with the source of an emote.',
    usage: `maxemote <emotename>`,
    help: `**emotename** : name of the emote you wish the bot to post from the database`,
    execute(bot, message, args){
        if (args[0] == undefined) return message.reply(`I can't look for nothing!`);
        const Discord = require('discord.js');
        const fs = require('fs');
        const emoteFiles = fs.readdirSync('./media/img/discordblobs').filter(file => file.toLowerCase().includes(args[0].toLowerCase()));
        const files = [];
        if (emoteFiles == '') {
            emote = bot.emojis.cache.find(emoji => emoji.name.toLowerCase() == args[0].toLowerCase());
            if (emote == null) emote = bot.emojis.cache.find(emoji => emoji.name.toLowerCase().includes(args[0].toLowerCase()));
            if (emote == null)
                return message.reply(`no emote was found! :(`);
            let url = emote.url;
            url = url.split('/');
            files.push(new Discord.MessageAttachment(`${emote.url}`))
            const exampleEmbed = new Discord.MessageEmbed()
                .setTitle(`Max res of ${emote.name}`)
                .setImage(`attachment://${url[url.length-1]}`);
            message.channel.send({embeds: [exampleEmbed], files: files});
            return 0;
        }
        namefile = emoteFiles[0].split('/');
        file = namefile[namefile.length-1];
        files.push(new Discord.MessageAttachment(`./media/img/discordblobs/${emoteFiles[0]}`))
        const exampleEmbed = new Discord.MessageEmbed()
    	    .setTitle(`Max res of ${file}`)
            .setImage(`attachment://${file}`);

        message.channel.send({embeds: [exampleEmbed], files: files});
        return 0;
    }
}