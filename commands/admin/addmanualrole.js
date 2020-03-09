module.exports = {
    name: 'addmanualrole',
    description: `Adds a role to the list of roles a user can give himself.`,
    usage: `addmanualrole <rolename>`,
    help: `**rolename** : the name of the role you want people to set themselves
            \tPlease make sure there is only one role with that name!`,
    async execute(bot, message, args){
        //.hasPermission('ADMINISTRATOR')
        if ((!message.member.hasPermission('ADMINISTRATOR')) && (message.author.id != '169525036305219585')){
            return message.reply("you are not allowed to use this command!");
        };
        if (args[0] == undefined) return message.channel.send("No role specified!");
        role = message.guild.roles.find(role => role.name == args[0]);
        if (role == null) return message.channel.send("Role was not found on this server!");
        bot.guildList.forEach(guild => {
            if (guild.guildID == message.guild.id){
                if (guild.roles == undefined) guild.roles = [];
                var index = guild.roles.indexOf(role.id);
                if (index == -1) {
                    guild.roles.push(role.id);
                    bot.guildUpdate();
                    return message.channel.send("Role was added to the list!");
                } else {
                    return message.channel.send("Role was already in the list!");
                }
            }
        })
    }
}