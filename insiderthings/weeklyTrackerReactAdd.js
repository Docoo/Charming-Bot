module.exports = {
    name: 'weeklyTrackerReactAdd',
    description: 'Someone completed a weekly task',
    async execute(bot, reaction, user){
        const thisGuild = reaction.message.guild;
		const thisChannel = reaction.message.channel;
        const thisMessage = reaction.message;
        const weeklyTracker = bot.getWeeklyTrackerById(thisMessage.id);
        if (weeklyTracker == undefined) { console.log("no tracker found"); return; }
        if (weeklyTracker.userID != user.id) { console.log("user reacted to someone else's tracker"); return; }
        switch (reaction.emoji.id) {
            case "911415406550450269":
                //weeklies
                weeklyTracker.weeklies = true;
                break;
            case "911415406865039361":
                //bt
                weeklyTracker.bt = true;
                break;
            case "911415407007649792":
                //vt
                weeklyTracker.vt = true;
                break;
            case "911415406986661898":
                //tt
                weeklyTracker.tt = true;
                break;
            case "911415407053778954":
                //et
                weeklyTracker.et = true;
                break;
            default:
                break;
        }
        bot.updateOneWeeklyTracker(weeklyTracker);
        const Discord = require('discord.js');
        const embed = new Discord.EmbedBuilder()
            .setTitle(`Weeklies for ${weeklyTracker.name}`)
            .addFields([
                {
                    name: "**Progress:**", 
                    value: `${bot.getEmoteById("911415406550450269")}Weeklies: ${weeklyTracker.weeklies ? bot.getEmoteById("911417771517165608") : bot.getEmoteById("911417514683158569")}
                            ${bot.getEmoteById("911415406865039361")}BT: ${weeklyTracker.bt ? bot.getEmoteById("911417771517165608") : bot.getEmoteById("911417514683158569")}
                            ${bot.getEmoteById("911415407007649792")}VT/SK: ${weeklyTracker.vt ? bot.getEmoteById("911417771517165608") : bot.getEmoteById("911417514683158569")}
                            ${bot.getEmoteById("911415406986661898")}TT: ${weeklyTracker.tt ? bot.getEmoteById("911417771517165608") : bot.getEmoteById("911417514683158569")}
                            ${bot.getEmoteById("911415407053778954")}ET: ${weeklyTracker.et ? bot.getEmoteById("911417771517165608") : bot.getEmoteById("911417514683158569")}`
                }
            ])
            .setTimestamp(new Date(weeklyTracker.date));
        //console.dir(embed);
        reaction.message.edit({ embeds: [embed] })
        return;
    }
}
