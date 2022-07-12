module.exports = {
    name: 'rolereactionapply',
    description: 'Allows role assignment from watches.',
    async execute(bot, reaction, user){
		for (index in bot.guildList){
			if (bot.guildList[index].guildID == reaction.message.guildId)
				thisGuild = bot.guildList[index];
        }
		if (!(thisGuild == undefined)) {
			for (index in thisGuild.roleWatches){
                watch = thisGuild.roleWatches[index];
                if (((watch.emoji == reaction.emoji.id) || (watch.emoji == reaction.emoji) || (watch.emoji == reaction.emoji.name)) && (watch.msgID == reaction.message.id)){

                    if (thisGuild.roleToggles.indexOf(reaction.message.id) > -1){
                        //console.log("Should remove old role")
                        for (const react of reaction.message.reactions.cache){
                            //console.dir(react[1].emoji);
                            for (index in thisGuild.roleWatches){
                                watch2 = thisGuild.roleWatches[index];
                                //console.log(react[1], ', ', react[1].emoji.name);
                                if ((watch2.emoji == react[1].emoji.id || watch2.emoji == react[1].emoji.name) && 
                                    ((react[1].emoji.id != reaction.emoji.id && reaction.emoji.id != null) || (react[1].emoji.name != reaction.emoji.name && reaction.emoji.id == null)) && 
                                    watch2.msgID == react[1].message.id){
                                    react[1].users.fetch().then(users => {
                                        if (users.has(user.id)){
                                            let roleToRemove = reaction.message.guild.roles.resolve(watch2.role);
                                            reaction.message.guild.members.cache.get(user.id).roles.remove(roleToRemove, "bot-auto-reaction");
                                            react[1].remove(user);
                                            console.log(`Role ${roleToRemove.name} taken from ${user.username} in server ${reaction.message.guild.name}`);
                                        }
                                    })
                                }
                            }
                        }
                    }

                    role = bot.guilds.cache.get(reaction.message.guildId).roles.cache.find(role => role.id == watch.role);
                    bot.guilds.cache.get(reaction.message.guildId).members.cache.get(user.id).roles.add(role, "bot-auto-reaction");
                    console.log(`Role ${role.name} given to ${user.username} in server ${bot.guilds.cache.get(reaction.message.guildId).name}`);
                    
                    return;
                }
            }
        }
        return;
    }
}
