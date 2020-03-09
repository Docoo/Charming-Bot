module.exports = {
    name: 'neko',
    description: 'Summon a neko!',
    usage: `neko`,
    help: ``,
    execute(bot,message,args){
        
        const Discord = require('discord.js');
        const fs = require('fs');
        const emoteFiles = fs.readdirSync('./media/img/neko');
        const nekoGifs = fs.readdirSync('./media/gif/neko');
        let exampleEmbed;
        //console.log(`Emote files: ${emoteFiles.toString()}`);
        let number = Math.floor(Math.random() * (emoteFiles.length + nekoGifs.length));
        let smallnumber = number-emoteFiles.length;
        //console.log(`Number: ${number}`);
        if (number < emoteFiles.length)
            namefile = emoteFiles[number].split('/')
        else
            namefile = nekoGifs[smallnumber].split('/');
        //console.log(`File path: ${namefile}`);
        file = namefile[namefile.length-1];
        //console.log(`File name: ${file}`);
        if (number < emoteFiles.length)
            exampleEmbed = new Discord.RichEmbed()
    	        .setTitle(`${message.author.username} summoned a neko!`)
    	        .attachFiles([`./media/img/neko/${emoteFiles[number]}`])
                .setImage(`attachment://${file}`)
        else
            exampleEmbed = new Discord.RichEmbed()
                .setTitle(`${message.author.username} summoned a neko!`)
                .attachFiles([`./media/gif/neko/${nekoGifs[smallnumber]}`])
                .setImage(`attachment://${file}`);
        message.channel.send(exampleEmbed);
        console.log(exampleEmbed);
        return 0;
    }
}