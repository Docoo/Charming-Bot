module.exports = {
    name: 'updateguildlist',
    description: `Updates the list of guilds in the bot files`,
    async execute(bot, message, args){
        bot.guilds.forEach(guild => {
            console.log(`ID: ${guild.id}, name: ${guild.name}`);
            let thisGuild = undefined;
            bot.guildList.forEach(botguild => {
                if (botguild.guildID == guild.id) thisGuild = botguild;
            });
            if (thisGuild == undefined){
                thisGuild = {guildID: `${guild.id}`, prefix : `cactus `};
                bot.guildList.push(thisGuild);
            }
            thisGuild.name = guild.name;
            if (thisGuild.roles == undefined) thisGuild.roles = [];
            if (thisGuild.roleWatches == undefined) thisGuild.roleWatches = [];
            if (thisGuild.roleToggles == undefined) thisGuild.roleToggles = [];
            if (thisGuild.defaultChannel != undefined){
                guild = bot.guilds.get(thisGuild.guildID);
                channel = guild.channels.get(thisGuild.defaultChannel);
                if (channel.type != 'text'){
                    thisGuild.defaultChannel = undefined;
                }
            }
            if (thisGuild.dailyQuiz == undefined) thisGuild.dailyQuiz = null;
            if (thisGuild.autoQuizUpdate == undefined) thisGuild.autoQuizUpdate = false;
            if (thisGuild.dailyQuizAnswers == undefined) thisGuild.dailyQuizAnswers = [];
            if (thisGuild.dailyQuizManager == undefined) thisGuild.dailyQuizManager = null;
            if (thisGuild.dailyQuizChannel == undefined) thisGuild.dailyQuizChannel = null;
            if (thisGuild.bnsRecNick == undefined) thisGuild.bnsRecNick = false;
        });
        bot.guildUpdate();
        console.log("Successfully updated!");
        if (!(message == undefined || message == null)) return message.channel.send("Successfully updated!");
        return 0;
    }
}