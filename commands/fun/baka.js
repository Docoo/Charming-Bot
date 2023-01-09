module.exports = {
    name: 'baka',
    description: 'Baka!',
    usage: `baka`,
    help: `b-baka!`,
    execute(bot,message,args){
        
        const Discord = require('discord.js');
        const fs = require('fs');
        const emoteFiles = fs.readdirSync('./media/gif/baka');
        number = Math.floor(Math.random() * emoteFiles.length);
        namefile = emoteFiles[number].split('/');
        file = namefile[namefile.length-1];
        const files = []
        files.push(new Discord.AttachmentBuilder(`./media/gif/baka/${emoteFiles[number]}`))
        const exampleEmbed = new Discord.EmbedBuilder()
    	    .setTitle(`Baka!`)
            .setImage(`attachment://${file}`);
        message.channel.send({ embeds: [exampleEmbed], files: files});
        return 0;
    }
}