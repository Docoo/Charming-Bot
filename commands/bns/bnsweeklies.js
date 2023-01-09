module.exports = {
    name: "bnsweeklies",
    description: "Keep track of weeklies on a character. Resets weekly.",
    usage: `bnsweeklies <whatever_you_want>`,
    help: `<whatever_you_want> - any text that helps you keep track of your characters`,
    async execute(bot,message,args){


        const Discord = require('discord.js');
        let aname = bot.sum(args, " ");
        const date = new Date();

        const embed = new Discord.EmbedBuilder()
            .setTitle(`Weeklies for ${aname}`)
            .addFields([{
                name: "**Progress:**",
                value: `${bot.getEmoteById(911415406550450269)}Weeklies: ${bot.getEmoteByName("weeklies_not_done")}
                        ${bot.getEmoteById(911415406865039361)}BT: ${bot.getEmoteByName("weeklies_not_done")}
                        ${bot.getEmoteById(911415407007649792)}VT/SK: ${bot.getEmoteByName("weeklies_not_done")}
                        ${bot.getEmoteById(911415406986661898)}TT: ${bot.getEmoteByName("weeklies_not_done")}
                        ${bot.getEmoteById(911415407053778954)}ET: ${bot.getEmoteByName("weeklies_not_done")}`
            }])
            .setTimestamp(date);
        message.channel.send({embeds: [embed]}).then(async sentMessage => {
            bot.reactWeeklyTracker(sentMessage);
            bot.initWeeklyTracker(message.author.id, message.channel.guild.id, message.channel.id, sentMessage.id, aname, date);
        });
        return 0;
    }
}