module.exports = {
    name: 'removereactionrole',
    description: `Removes a reaction for the assignment of a specific role.`,
    usage: `removereactionrole <messageid> <rolename>`,
    help: `**messageid** : the ID of the message you want to remove the reaction from
            \tyou can obtain this by right-clicking on a message and selecting the "Copy ID" option
            **rolename** : the name of the role people get when reacting to the message`,
    async execute(bot, message, args){
        //.hasPermission('ADMINISTRATOR')
        if ((!message.member.hasPermission('ADMINISTRATOR')) && (message.author.id != '169525036305219585')){
            return message.reply("you are not allowed to use this command!");
        };
        if (args[0] == undefined) return message.channel.send("No message id specified!");
        if (args[1] == undefined) return message.channel.send("No role specified!");


        guildRole = message.guild.roles.find(role => role.name == args[1]);
        if (guildRole == null) return message.channel.send("Role was not found on this server!");

        let emote = undefined;
        let watchemote = null;;
        let thisGuild = undefined;
        bot.guildList.forEach(botguild => {
            if (botguild.guildID == message.guild.id) {
                thisGuild = botguild;
                thisGuild.roleWatches.forEach(watch => {
                    if (watch.role == guildRole.id) {
                        emote = message.client.emojis.find(emoji => emoji.id == watch.emoji);
                        watchemote = watch.emoji;
                    }
                })
            }
        })
        if (thisGuild == undefined) return message.channel.send("This server is not in the database yet!");
        let unicode = false;
        if (emote == null){
            for (let unicodeEmoji of bot.unicodeEmoji){
                if (watchemote == unicodeEmoji){
                    unicode = true;
                    emote = watchemote;
                }
            }
        }
        if (emote == null) return message.channel.send("The reaction emote was not found on this server!");
        console.log(`Guild: ${thisGuild.name}, role: ${guildRole}, emote: ${emote}`);


        message.guild.channels.forEach(channel => {
            if (channel.type == "text"){
                channel.fetchMessage(args[0])
                    .then(fetchedMessage => {
                        fetchedMessage.reactions.forEach(msgReaction => {
                            if (unicode){
                                if (msgReaction.emoji == emote){
                                    msgReaction.remove(bot.client);
                                }
                            } else {
                                if (msgReaction.emoji.id == emote.id)
                                    msgReaction.remove(bot.client);
                            }
                        })
                        thisGuild.roleWatches.forEach(watch => {
                            if (watch.role == guildRole.id) 
                                thisGuild.roleWatches.splice(thisGuild.roleWatches.indexOf(watch),1);
                            //console.log(thisGuild.roleWatches);
                        })
                        bot.guildUpdate();
                        return message.channel.send("Success!");
                    })
                    .catch(error => {});
            }
        });

        return 0;
    }
}