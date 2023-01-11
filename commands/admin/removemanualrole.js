module.exports = {
    name: 'removemanualrole',
    description: `Removes a role from the list of roles a user can give himself.`,
    usage: `removemanualrole <roleID>`,
    help: `**rolename** : the name of the role you no longer want people to set themselves
            \tYou can obtain the ID of a role by sending a message with \\@role and taking the numerical value`,
    async execute(bot, message, args){
        //.hasPermission('ADMINISTRATOR')
        if (!bot.adminOrMeCheck(message)) return message.reply("you are not allowed to use this command!");
        if (args[0] == undefined) return message.channel.send("No role specified!");
        role = message.guild.roles.resolve(args[0]);
        if (role == null) return message.channel.send("Role was not found on this server!");
        bot.guildList.forEach(guild => {
            if (guild.guildID == message.guild.id){
                if (guild.roles == undefined) guild.roles = [];
                const index = guild.roles.indexOf(guild.roles.find(roleEntry => roleEntry.id == role.id));
                if (index !== -1) {
                    guild.roles.splice(index, 1);
                    bot.guildUpdate();
                    return message.channel.send("Role was removed from the list!");
                } else {
                    return message.channel.send("Role was not found in the list!");
                }
            }
        })
    }
}