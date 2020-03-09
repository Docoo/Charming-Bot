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
        if (emoteFiles == '') {
            emote = bot.emojis.find(emoji => emoji.name.toLowerCase() == args[0].toLowerCase());
            if (emote == null) emote = bot.emojis.find(emoji => emoji.name.toLowerCase().includes(args[0].toLowerCase()));
            console.log(`Emoji: ${emote}`);
            if (emote == null)
                return message.reply(`no emote was found! :(`);
            let url = emote.url;
            url = url.split('/');
            const exampleEmbed = new Discord.RichEmbed()
                .setTitle(`Max res of ${emote.name}`)
                .attachFiles([`${emote.url}`])
                .setImage(`attachment://${url[url.length-1]}`);
            message.channel.send(exampleEmbed);
            return 0;
        }
        console.log(`Emote files: ${emoteFiles.toString()}`);
        namefile = emoteFiles[0].split('/');
        console.log(`File path: ${namefile}`);
        file = namefile[namefile.length-1];
        console.log(`File name: ${file}`);
        const exampleEmbed = new Discord.RichEmbed()
    	    .setTitle(`Max res of ${file}`)
    	    .attachFiles([`./media/img/discordblobs/${emoteFiles[0]}`])
            .setImage(`attachment://${file}`);

        message.channel.send(exampleEmbed);
        return 0;
    }
}