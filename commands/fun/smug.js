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
        const exampleEmbed = new Discord.RichEmbed()
    	    .setTitle(`${message.author.displayName} smiles proudly!`)
    	    .attachFiles([`./media/gif/smug/${emoteFiles[number]}`])
            .setImage(`attachment://${file}`);
        message.channel.send(exampleEmbed);
        return 0;
    }
}
