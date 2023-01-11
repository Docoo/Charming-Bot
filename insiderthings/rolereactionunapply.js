module.exports = {
    name: 'rolereactionunapply',
    description: 'Allows role unassignment from watches.',
    async execute(bot, reaction, user){
        let thisGuild = undefined;
		for (index in bot.guildList){
			if (bot.guildList[index].guildID == reaction.message.guild.id)
				thisGuild = bot.guildList[index];
        }
		if (!(thisGuild == undefined)) {
			for (index in thisGuild.roleWatches){
                watch = thisGuild.roleWatches[index];
                if ((watch.emoji == reaction.emoji.id || watch.emoji == reaction.emoji.name) && (watch.msgID == reaction.message.id)){
                    role = reaction.message.guild.roles.resolve(watch.role);
                    reaction.message.guild.members.fetch(user.id).then(member => {
                        member.roles.remove(watch.role, "bot-auto-reaction")
                        console.log(`Role ${role.name} taken from ${user.username} in server ${reaction.message.guild.name}`);
                    })
                    return;
                }
            }
        }
        return;
    }
}