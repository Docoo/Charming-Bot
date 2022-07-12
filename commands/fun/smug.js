module.exports = {
    name: 'smug',
    description: 'Show hou proud you are!',
    usage: `smug`,
    help: ``,
    execute(bot,message,args){
        
        const Discord = require('discord.js');
        const fs = require('fs');
        const emoteFiles = fs.readdirSync('./media/gif/smug');
        //console.log(`Emote files: ${emoteFiles.toString()}`);
        number = Math.floor(Math.random() * emoteFiles.length);
        //console.log(`Number: ${number}`);
        namefile = emoteFiles[number].split('/');
        //console.log(`File path: ${namefile}`);
        file = namefile[namefile.length-1];
        //console.log(`File name: ${file}`);
        const files = []
        files.push(new Discord.MessageAttachment(`./media/gif/smug/${emoteFiles[number]}`))
        const exampleEmbed = new Discord.MessageEmbed()
    	    .setTitle(`${message.member.displayName} smiles proudly!`)
            .setImage(`attachment://${file}`);
        message.channel.send({embeds: [exampleEmbed], files: files});
        return 0;
    }
}
