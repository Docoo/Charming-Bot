module.exports = {
    name: 'rolereactionapply',
    description: 'Allows role assignment from watches.',
    async execute(bot, reaction, user){
        let thisGuild = undefined;
		for (index in bot.guildList){
			if (bot.guildList[index].guildID == reaction.message.guild.id)
				thisGuild = bot.guildList[index];
        }
		if (!(thisGuild == undefined)) {
			for (index in thisGuild.roleWatches){
                watch = thisGuild.roleWatches[index];
                if (((watch.emoji == reaction.emoji.id) || (watch.emoji == reaction.emoji)) && (watch.msgID == reaction.message.id)){

                    if (thisGuild.roleToggles.indexOf(reaction.message.id) > -1){
                        for (let react of reaction.message.reactions[Symbol.iterator]()){
                            //console.log(react[1].emoji.id);
                            for (index in thisGuild.roleWatches){
                                watch2 = thisGuild.roleWatches[index];
                                //console.log(react[1], ', ', react[1].emoji.name);
                                if ((watch2.emoji == react[1].emoji.id || watch2.emoji == react[1].emoji) && 
                                    react[1].emoji.id != reaction.emoji.id && 
                                    watch2.msgID == react[1].message.id){
                                    react[1].fetchUsers().then(users => {
                                        if (users.has(user.id)){
                                            let roleToRemove = reaction.message.guild.roles.find(role => role.id == watch2.role);
                                            reaction.message.guild.members.get(user.id).removeRole(roleToRemove, "bot-auto-reaction");
                                            react[1].remove(user);
                                            console.log(`Role ${roleToRemove.name} taken from ${user.username} in server ${reaction.message.guild.name}`);
                                        }
                                    })
                                }
                            }
                        }
                    }

                    role = reaction.message.guild.roles.find(role => role.id == watch.role);
                    reaction.message.guild.members.get(user.id).addRole(role, "bot-auto-reaction");
                    console.log(`Role ${role.name} given to ${user.username} in server ${reaction.message.guild.name}`);
                    
                    return;
                }
            }
        }
        return;
    }
}
