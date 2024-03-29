module.exports = {
    name: 'iam',
    description: `Allows a user to give himself a self-manageable role.`,
    usage: `iam <role>`,
    help: `**role** : name of the role you wish to assign yourself`,
    async execute(bot, message, args){
        if (args[0] == undefined){
            let msgString = "No role specified!";
            for (let guild of bot.guildList){
                if (guild.guildID == message.guild.id){
                    if (guild.roles.length == 0) msgString += `\nNo roles can be self-given on this server!`
                    else {
                        msgString += `\nThe roles a user can self-give on this server are:\n`;
                        for (let role of guild.roles){
                            msgString += `\`${message.channel.guild.roles.resolve(role.id).name}\` `;
                        }
                    }
                }
            }
            return message.channel.send(msgString);
        }
        bot.guildList.forEach(guild => {
            if (guild.guildID == message.guild.id){
                if (guild.roles == undefined) return message.channel.send("This server does not allow users to set their roles.");
                role = guild.roles.find(role => role.name == args[0]);
                if (role == null) return message.channel.send("Role cannot be set by user or does not exist!");
                message.member.roles.add(role.id, 'iam');
                return message.channel.send("Role assigned successfully!");
            }
        })
    }
}