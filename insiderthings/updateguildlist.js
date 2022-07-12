module.exports = {
    name: 'updateguildlist',
    description: `Updates the list of guilds in the bot files`,
    async execute(bot, message, args){
        bot.guilds.cache.forEach(guild => {
            console.log(`ID: ${guild.id}, name: ${guild.name}`);
            console.log("Admin:" + guild.me.permissions.has("ADMINISTRATOR"));
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
                guild = bot.guilds.cache.get(thisGuild.guildID);
                channel = guild.channels.cache.get(thisGuild.defaultChannel);
                if (channel.type != 'GUILD_TEXT'){
                    thisGuild.defaultChannel = undefined;
                }
            }
            if (thisGuild.dailyQuiz == undefined) thisGuild.dailyQuiz = null;
            if (thisGuild.autoQuizUpdate == undefined) thisGuild.autoQuizUpdate = false;
            if (thisGuild.dailyQuizAnswers == undefined) thisGuild.dailyQuizAnswers = [];
            if (thisGuild.dailyQuizManager == undefined) thisGuild.dailyQuizManager = null;
            if (thisGuild.dailyQuizChannel == undefined) thisGuild.dailyQuizChannel = null;
            if (thisGuild.bnsRecNick == undefined) thisGuild.bnsRecNick = false;
            if (thisGuild.protectFromEveryoneTag == undefined) thisGuild.protectFromEveryoneTag = false;
            if (thisGuild.bnsMaintenanceChannel == undefined) thisGuild.bnsMaintenanceChannel = null;
        });
        bot.guildUpdate();
        console.log("Successfully updated!");
        if (!(message == undefined || message == null)) return message.channel.send("Successfully updated!");
        return 0;
    }
}