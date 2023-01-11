module.exports = {
    name: 'removereactionrole',
    description: `Removes a reaction for the assignment of a specific role.`,
    usage: `removereactionrole <messageID> <roleID>`,
    help: `**messageID** : the ID of the message you want to remove the reaction from
            \tyou can obtain this by right-clicking on a message and selecting the "Copy ID" option
            **roleID** : the ID of the role people get when reacting to the message`,
    async execute(bot, message, args){
        //.hasPermission('ADMINISTRATOR')
        if (!bot.adminOrMeCheck(message)) return message.reply("you are not allowed to use this command!");
        if (args[0] == undefined) return message.channel.send("No message id specified!");
        if (args[1] == undefined) return message.channel.send("No role specified!");

        //check if role exists on server
        const role = message.guild.roles.resolve(args[1]);
        if (role == null) return message.channel.send("Role was not found on this server!");

        //find server config
        let thisGuild = undefined;
        bot.guildList.forEach(botguild => {
            if (botguild.guildID == message.guild.id) {
                thisGuild = botguild;
            }
        })
        if (thisGuild == undefined) return message.channel.send("This server is not in the database yet!");

        //find the watch
        var watch = null
        thisGuild.roleWatches.forEach(guildWatch => {
            if (guildWatch.role == role.id) {
                watch = guildWatch
            }
        })
        if (watch == null) return message.channel.send("Role reaction was not found!")

        //find the emoji
        var emoji = bot.emojis.resolve(watch.emoji);
        if (emoji == null) 
            if (bot.unicodeEmoji.indexOf(watch.emoji) > -1)
                emoji = watch.emoji
            else
                return message.channel.send("The reaction emote is no longer available!");

        //find the message
        message.guild.channels.cache.forEach(channel => {
            if (channel.type == require('discord.js').ChannelType.GuildText){
                channel.messages.fetch(args[0])
                    .then(fetchedMessage => {
                        //remove the reaction, remove the watch and save
                        const reaction = fetchedMessage.reactions.resolve(bot.unicodeEmoji.includes(emoji)?emoji:emoji.id)
                        if (reaction == null)
                            message.channel.send("Reaction not present on found message.")
                        else
                            reaction.remove()
                        thisGuild.roleWatches.splice(thisGuild.roleWatches.indexOf(watch),1);
                        bot.guildUpdate();
                        console.log(`Removed role reaction. Guild: ${thisGuild.name}, role: ${role}, emote: ${emoji}`);
                        return message.channel.send("Success!");
                    })
                    .catch(error => {});
            }
        });

        return 0;
    }
}