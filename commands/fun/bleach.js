module.exports = {
    name: 'bleach',
    description: 'Give someone a glass of bleach',
    usage: `bleach <user>`,
    help: `**user** : the user to give bleach to`,
    execute(bot,message,args){
        let myUser = null;
        const member = message.mentions.members.first();
        //console.log(member);
        const name = bot.sum(args);
        console.log(name);
        if (member != undefined){
            myUser = member;
        } else {
            for (let user of message.channel.guild.members){
                user = user[1];
                //console.log(user.displayName.toLowerCase().length + ", " + user.user.username.toLowerCase().length + ", " + name.toLowerCase().length);
                if (user.displayName.toLowerCase() == name.toLowerCase() || user.user.username.toLowerCase() == name.toLowerCase()){
                    myUser = user;
                    break;
                }
            }
            if (myUser == null){
                for (let user of message.channel.guild.members){
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
        const exampleEmbed = new Discord.RichEmbed()
    	    .setTitle(`${myUser.displayName}, your bleach has been served!`)
    	    .attachFiles([`./media/img/bleach.jpg`])
            .setImage(`attachment://bleach.jpg`);
        message.channel.send(exampleEmbed);
        return 0;
    }
}
