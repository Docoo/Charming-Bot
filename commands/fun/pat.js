module.exports = {
    name: 'pat',
    description: 'Pat someone UwU',
    usage: `pat <user>`,
    help: `**user** : name of the user you wish to pat`,
    execute(bot,message,args){
        let myUser = null;
        const member = message.mentions.members.first();
        //console.log(member);
        const name = bot.sum(args);
        console.log(name);
        if (member != undefined){
            myUser = member;
        } else {
            for (let user of message.channel.guild.members.cache){
                user = user[1];
                //console.log(user.displayName.toLowerCase().length + ", " + user.user.username.toLowerCase().length + ", " + name.toLowerCase().length);
                if (user.displayName.toLowerCase() == name.toLowerCase() || user.user.username.toLowerCase() == name.toLowerCase()){
                    myUser = user;
                    break;
                }
            }
            if (myUser == null){
                for (let user of message.channel.guild.members.cache){
                    user = user[1];
                    if (user.displayName.toLowerCase().includes(name.toLowerCase()) || user.user.username.toLowerCase().includes(name.toLowerCase())){
                        myUser = user;
                        break;
                    }
                }
            }
        }
        if (myUser == null) return message.channel.send("The specified user was not found!");
		const user = myUser.user;
        const Discord = require('discord.js');
        const fs = require('fs');
        const emoteFiles = fs.readdirSync('./media/gif/pat');
        number = Math.floor(Math.random() * emoteFiles.length);
        console.log(`Number: ${number}`);
        namefile = emoteFiles[number].split('/');
        console.log(`File path: ${namefile}`);
        file = namefile[namefile.length-1];
        console.log(`File name: ${file}`);
        const messageAttachment = new Discord.AttachmentBuilder().setFile(`./media/gif/pat/${emoteFiles[number]}`);
        const messageEmbed = new Discord.EmbedBuilder()
    	    .setTitle(`${message.member.displayName} pat ${myUser.displayName}!`)
            .setImage(`attachment://${file}`);
        if ((message.author.username == user.username)) 
            messageEmbed.setTitle(`${message.member.displayName}, have a pat!`);
        message.channel.send({
            embeds: [
                messageEmbed
            ],
            files: [
                messageAttachment
            ]
        });
        return 0;
    }
}
