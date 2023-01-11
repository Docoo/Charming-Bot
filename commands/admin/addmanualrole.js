module.exports = {
    name: 'addmanualrole',
    description: `Adds a role to the list of roles a user can give himself.`,
    usage: `addmanualrole <roleID>`,
    help: `**rolename** : the ID of the role you want people to set themselves
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
                var found = false
                for (const roleEntry in guild.roles){
                    if (roleEntry.id == role.id || roleEntry.name == role.name) found = true
                }
                if (!found) {
                    guild.roles.push({ id: role.id, name: role.name });
                    bot.guildUpdate();
                    return message.channel.send("Role was added to the list!");
                } else {
                    return message.channel.send("There already is a user settable role with that id and/or name!");
                }
            }
        })
    }
}