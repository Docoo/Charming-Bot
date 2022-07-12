module.exports = {
    name: 'addreactionrole',
    description: `Allows set up of reaction role assignment.`,
    usage: `addreactionrole <messageid> <rolename> <emojitype> <emojiname>`,
    help: `**messageid** : the ID of the message you want to add the reaction to
            \tyou can obtain this by right-clicking on a message and selecting the "Copy ID" option
            **rolename** : the name of the role people will get when reacting to the message
            \tplease make sure the role is user settable (done with the "addmanualrole" command!)
            **emojitype : custom (added on server) or standard (from discord, available on all servers)
            **emojiname** : the name of the emoji the reaction will use
            \tyou can obtain this by hovering your mouse pointer over an emoji in a message
            ***WARNING! ONLY CUSTOM EMOJI WILL WORK! UNICODE EMOJI NOT SUPPORTED!***`,
    async execute(bot, message, args){
        //.hasPermission('ADMINISTRATOR')
        if ((!message.member.permissions.has('ADMINISTRATOR')) && (message.author.id != '169525036305219585')){
            return message.reply("you are not allowed to use this command!");
        };
        if (args[0] == undefined) return message.channel.send("No message id specified!");
        if (args[1] == undefined) return message.channel.send("No role specified!");
        if (args[2] == undefined || (args[2] != "custom" && args[2] != "standard")) return message.channel.send("Invalid emoji type (must be \"custom\" or \"standard\")!");
        if (args[3] == undefined) return message.channel.send("No emote specified!");


        guildRole = message.guild.roles.cache.find(role => role.name == args[1]);
        if (guildRole == null) return message.channel.send("Role was not found on this server!");

        let unicode = false;
        let thisGuild = undefined;
        bot.guildList.forEach(botguild => {
            if (botguild.guildID == message.guild.id) thisGuild = botguild;
        })
        if (thisGuild == undefined) return message.channel.send("This server is not in the database yet!");
        
        let emote = null;
        if (args[2] == "custom"){
            let emotename = args[3].split(":")[1];
            if (emotename == null || emotename == undefined) emotename = args[3];
            emote = message.channel.guild.emojis.cache.find(emoji => emoji.name == emotename);
            if (emote == null) emote = message.client.emojis.cache.find(emoji => emoji.name == emotename);
        } else {
            let emotename = args[3];
            if (emote == null) {
                for (let unicodeEmoji of bot.unicodeEmoji){
                    if (emotename == unicodeEmoji){
                        emote = emotename;
                        unicode = true;
                    }
                }
            }
        }
        if (emote == null) return message.channel.send("Emoji not found!");
        console.log(`Guild: ${thisGuild.name}, role: ${guildRole}, emote: ${emote}`);

        for (index in thisGuild.roleWatches) {
            watch = thisGuild.roleWatches[index];
            if (watch.role == guildRole.id) return message.channel.send("There is a watch for this role already!");
        };
        let settablerole = false;
        for (index in thisGuild.roles) {
            roleID = thisGuild.roles[index];
            if (guildRole.id == roleID) settablerole = true;
        }
        if (!settablerole) return message.channel.send("This role is not user settable!");

        bot.guilds.resolve(message.guildId).channels.cache.forEach(channel => {
            if (channel.type == "GUILD_TEXT"){
                channel.messages.fetch(args[0])
                    .then(fetchedMessage => {
                        // for (watch in thisGuild.roleWatches) {
                        //     if (watch.role == guildRole.id) return;
                        // };
                        fetchedMessage.react(emote);
                        thisGuild.roleWatches.push({msgID: args[0], role: guildRole.id, emoji: unicode == false ? emote.id : emote});
                        bot.guildUpdate();
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
