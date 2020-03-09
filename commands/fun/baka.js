module.exports = {
    name: 'baka',
    description: 'Baka!',
    usage: `baka`,
    help: `b-baka!`,
    execute(bot,message,args){
        
        const Discord = require('discord.js');
        const fs = require('fs');
        const emoteFiles = fs.readdirSync('./media/gif/baka');
        //console.log(`Emote files: ${emoteFiles.toString()}`);
        number = Math.floor(Math.random() * emoteFiles.length);
        //console.log(`Number: ${number}`);
        namefile = emoteFiles[number].split('/');
        //console.log(`File path: ${namefile}`);
        file = namefile[namefile.length-1];
        //console.log(`File name: ${file}`);
        const exampleEmbed = new Discord.RichEmbed()
    	    .setTitle(`Baka!`)
    	    .attachFiles([`./media/gif/baka/${emoteFiles[number]}`])
            .setImage(`attachment://${file}`);
        message.channel.send(exampleEmbed);
        return 0;
    }
}