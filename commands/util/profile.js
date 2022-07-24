module.exports = {
    name: "profile",
    description: "Displays a user's profile picture",
    usage: `profile <user>`,
    help: `**user** : the name of the user`,
    async execute(bot, message, args){
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
        if (myUser != null){
            const Discord = require('discord.js');
            const newEmbed = new Discord.MessageEmbed()
                .setTitle(`${name}'s profile picture`)
                .setImage(myUser.user.avatarURL);
            message.channel.send({
                embeds: [newEmbed]
            });
            return 0;
        } else {
            message.channel.send('Could not find the said user');
            return 0;
        }
    }
}
