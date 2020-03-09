module.exports = {
    name: 'waifu',
    description: 'Get a random waifu.',
    usage: `waifu`,
    help: ``,
    execute(bot,message,args){
        
        const Discord = require('discord.js');
        const fs = require('fs');
        const emoteFiles = fs.readdirSync('./media/img/waifu');
        //console.log(`Emote files: ${emoteFiles.toString()}`);
        number = Math.floor(Math.random() * emoteFiles.length);
        //console.log(`Number: ${number}`);
        namefile = emoteFiles[number].split('/');
        //console.log(`File path: ${namefile}`);
        file = namefile[namefile.length-1];
        //console.log(`File name: ${file}`);
        const exampleEmbed = new Discord.RichEmbed()
    	    .setTitle(`${message.author.displayName}, here is your waifu!`)
    	    .attachFiles([`./media/img/waifu/${emoteFiles[number]}`])
            .setImage(`attachment://${file}`);
        message.channel.send(exampleEmbed);
        return 0;
    }
}
