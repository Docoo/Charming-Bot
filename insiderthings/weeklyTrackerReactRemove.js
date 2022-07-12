module.exports = {
    name: 'weeklyTrackerReactRemove',
    description: 'Someone did an oopsie',
    async execute(bot, reaction, user){
        const thisGuild = reaction.message.guild;
		const thisChannel = reaction.message.channel;
        const thisMessage = reaction.message;
        const weeklyTracker = bot.getWeeklyTrackerById(thisMessage.id);
        if (weeklyTracker == undefined) return;
        if (weeklyTracker.userID != user.id) return;
        switch (reaction.emoji.id) {
            case "911415406550450269":
                //weeklies
                weeklyTracker.weeklies = false;
                break;
            case "911415406865039361":
                //bt
                weeklyTracker.bt = false;
                break;
            case "911415407007649792":
                //vt
                weeklyTracker.vt = false;
                break;
            case "911415406986661898":
                //tt
                weeklyTracker.tt = false;
                break;
            case "911415407053778954":
                //et
                weeklyTracker.et = false;
                break;
            default:
                break;
        }
        bot.updateOneWeeklyTracker(weeklyTracker);

        const Discord = require('discord.js');
        const embed = new Discord.MessageEmbed()
            .setTitle(`Weeklies for ${weeklyTracker.name}`)
            .addField("**Progress:**",`${bot.getEmoteById("911415406550450269")}Weeklies: ${weeklyTracker.weeklies ? bot.getEmoteById("911417771517165608") : bot.getEmoteById("911417514683158569")}
            ${bot.getEmoteById("911415406865039361")}BT: ${weeklyTracker.bt ? bot.getEmoteById("911417771517165608") : bot.getEmoteById("911417514683158569")}
            ${bot.getEmoteById("911415407007649792")}VT/SK: ${weeklyTracker.vt ? bot.getEmoteById("911417771517165608") : bot.getEmoteById("911417514683158569")}
            ${bot.getEmoteById("911415406986661898")}TT: ${weeklyTracker.tt ? bot.getEmoteById("911417771517165608") : bot.getEmoteById("911417514683158569")}
            ${bot.getEmoteById("911415407053778954")}ET: ${weeklyTracker.et ? bot.getEmoteById("911417771517165608") : bot.getEmoteById("911417514683158569")}`)
            .setTimestamp(new Date(weeklyTracker.date));
        reaction.message.edit({ embeds: [embed] });
        return;
    }
}
