module.exports = {
    name: 'rolereactionapply',
    description: 'Allows role assignment from watches.',
    async execute(bot, reaction, user){
        //get guild config
        const thisGuild = bot.guildList.find(myGuild => myGuild.guildID == reaction.message.guildId)
		if (!(thisGuild == undefined)) {
			for (const thisWatch of thisGuild.roleWatches){
                //find the right watch
                if (((thisWatch.emoji == reaction.emoji.id) || (thisWatch.emoji == reaction.emoji.name)) && (thisWatch.msgID == reaction.message.id)){
                    
                    //give the role
                    const guild = bot.guilds.resolve(reaction.message.guildId)
                    const role = guild.roles.resolve(thisWatch.role);
                    const member = guild.members.resolve(user.id)
                    member.roles.add(role, "role-react");
                    console.log(`Role ${role.name} given to ${user.username} in server ${guild.name}`);
                    
                    //check if it's part of a toggle
                    if (thisGuild.roleToggles.indexOf(reaction.message.id) > -1){

                        //if so, remove other reactions
                        const emoji = reaction.emoji.id==null?reaction.emoji.name:reaction.emoji.id;
                        for (const otherReaction of reaction.message.reactions.cache){
                            const otherEmoji = otherReaction[1].emoji.id==null?otherReaction[1].emoji.name:otherReaction[1].emoji.id
                            if (emoji != otherEmoji){
                                otherReaction[1].users.remove(user.id)
                            }
                        }
                    }
                }
            }
        }
    }
}
