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
        const files = []
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
        if (number < emoteFiles.length){
            files.push(new Discord.MessageAttachment(`./media/img/neko/${emoteFiles[number]}`))
            exampleEmbed = new Discord.MessageEmbed()
    	        .setTitle(`${message.author.username} summoned a neko!`)
                .setImage(`attachment://${file}`)
        } else {
            files.push(new Discord.MessageAttachment(`./media/gif/neko/${nekoGifs[smallnumber]}`))
            exampleEmbed = new Discord.MessageEmbed()
                .setTitle(`${message.author.username} summoned a neko!`)
                .setImage(`attachment://${file}`);
        }
        message.channel.send({embeds: [exampleEmbed], files: files});
        // console.log(exampleEmbed);
        return 0;
    }
}