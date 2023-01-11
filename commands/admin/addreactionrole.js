module.exports = {
    name: 'addreactionrole',
    description: `Allows set up of reaction role assignment.`,
    usage: `addreactionrole <messageid> <roleID> <emojiID>`,
    help: `**messageid** : the ID of the message you want to add the reaction to
            \tyou can obtain this by right-clicking on a message and selecting the "Copy ID" option
            **roleID** : the ID of the role people will get when reacting to the message
            \tplease make sure the role is user settable (done with the "addmanualrole" command!)
            **emojiID** : the name of the emoji the reaction will use
            \tyou can obtain this the same way you obtained the roleID`,
    async execute(bot, message, args){
        //.hasPermission('ADMINISTRATOR')
        if (!bot.adminOrMeCheck(message)) return message.reply("you are not allowed to use this command!");
        if (args[0] == undefined) return message.channel.send("No message id specified!");
        if (args[1] == undefined) return message.channel.send("No role specified!");
        if (args[2] == undefined) return message.channel.send("No emote specified!");

        //check if role exists on server
        const role = message.guild.roles.resolve(args[1]);
        if (role == null) return message.channel.send("Role was not found on this server!");

        //find server config
        let thisGuild = undefined;
        bot.guildList.forEach(botguild => {
            if (botguild.guildID == message.guild.id) thisGuild = botguild;
        })
        if (thisGuild == undefined) return message.channel.send("This server is not in the database yet!");

        //check if role is user settable
        if (thisGuild.roles.find(guildRole => guildRole.id == role.id) == null) return message.channel.send("This role is not user settable!")
        
        //find the emoji
        var emoji = bot.emojis.resolve(args[2])
        if (emoji == null) 
            if (bot.unicodeEmoji.indexOf(args[2]) > -1)
                emoji = args[2]
            else
                return message.channel.send("Emoji not found!");

        //check if role isn't watched already
        for (index in thisGuild.roleWatches) {
            watch = thisGuild.roleWatches[index];
            if (watch.role == role.id) return message.channel.send("There is a watch for this role already!");
        };

        //search for the message in all of the guild's channels
        bot.guilds.resolve(message.guildId).channels.cache.forEach(channel => {
            if (channel.type == require('discord.js').ChannelType.GuildText){
                channel.messages.fetch(args[0])
                    .then(fetchedMessage => {
                        //once found, react, add the watch to guild config and save
                        fetchedMessage.react(emoji);
                        thisGuild.roleWatches.push({msgID: args[0], role: role.id, emoji: bot.unicodeEmoji.includes(emoji)?emoji:emoji.id});
                        bot.guildUpdate();
                        console.log(`Added role reaction. Guild: ${thisGuild.name}, role: ${role}, emote: ${emoji}`);
                        return message.channel.send("Success!");
                    })
                    .catch(error => {});
            }
        });

        // return message.channel.send("So far so good!");
        // msg = null;
        // if (msg == null) return message.channel.send("Message with this id was not found on this server!");


        // bot.guildList.forEach(guild => {
        //     if (guild.guildID == message.guild.id){
        //         if (guild.roles == undefined) guild.roles = [];
        //         var index = guild.roles.indexOf(args[0]);
        //         if (index == -1) {
        //             guild.roles.push(args[0]);
        //             bot.guildUpdate();
        //             return message.channel.send("Role was added to the list!");
        //         } else {
        //             return message.channel.send("Role was already in the list!");
        //         }
        //     }
        // })
        return 0;
    }
}
