module.exports = {
    name: 'tickle',
    description: 'Tickle someone >:)',
    usage: `tickle <user>`,
    help: `**user** : name of the user you wish to tickle`,
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
        const emoteFiles = fs.readdirSync('./media/gif/tickle');
        number = Math.floor(Math.random() * emoteFiles.length);
        namefile = emoteFiles[number].split('/');
        file = namefile[namefile.length-1];
        const files = []
        files.push(new Discord.AttachmentBuilder(`./media/gif/tickle/${emoteFiles[number]}`))
        const exampleEmbed = new Discord.EmbedBuilder()
    	    .setTitle(`${message.member.displayName} tickled ${myUser.displayName}!`)
            .setImage(`attachment://${file}`);
        if ((message.author.username == user.username)) 
            exampleEmbed.setTitle(`${message.member.displayName}, i tickle thee! x3`);
        message.channel.send({attachments: [exampleEmbed], files: files});
        return 0;
    }
}
