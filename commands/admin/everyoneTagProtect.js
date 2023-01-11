module.exports = {
    name: 'everyonetagprotect',
    description: `Mutes a user if they tag everyone twice within a 5 minute interval.`,
    usage: `everyonetagprotect <rolename>`,
    help: `**rolename** : the name of the role used to mute people
            \tPlease make sure there is only one role with that name!
            \tUse without providing any rolename to disable.`,
    async execute(bot, message, args){
        //.hasPermission('ADMINISTRATOR')
        if (!bot.adminOrMeCheck(message)) return message.reply("you are not allowed to use this command!");
        if (args[0] == undefined) {
            bot.guildList.forEach(guild => {
                if (guild.guildID == message.guild.id){
                    guild.protectFromEveryoneTag = false;
                    guild.mutedRoleID = undefined;
                    bot.guildUpdate();
                    message.channel.send("Protection deactivated.");
                }
            })
            return;
        }
        role = message.guild.roles.cache.find(role => role.name == args[0]);
        if (role == null) return message.channel.send("Role was not found on this server!");
        bot.guildList.forEach(guild => {
            if (guild.guildID == message.guild.id){
                guild.protectFromEveryoneTag = true;
                if (guild.mutedRoleID == undefined) guild.mutedRoleID = role.id;
                var index = guild.roles.indexOf(role.id);
                bot.guildUpdate();
                return message.channel.send("Protection activated.");
            }
        })
    }
}