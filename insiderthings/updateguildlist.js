module.exports = {
    name: 'updateguildlist',
    description: `Updates the list of guilds in the bot files`,
    async execute(bot, message, args){
        const Discord = require('discord.js')
        bot.guilds.cache.forEach(guild => {
            if (!guild.members.me.permissions.has(Discord.PermissionFlagsBits.Administrator)){
                console.log(`ID: ${guild.id}, name: ${guild.name}`);
                console.log("Admin:" + guild.members.me.permissions.has(Discord.PermissionFlagsBits.Administrator));
            }
            let thisGuild = undefined;
            bot.guildList.forEach(botguild => {
                if (botguild.guildID == guild.id) thisGuild = botguild;
            });
            if (thisGuild == undefined){
                thisGuild = {guildID: `${guild.id}`, prefix : `cactus `};
                bot.guildList.push(thisGuild);
            }
            thisGuild.name = guild.name;
            //creating role list
            if (thisGuild.roles == undefined) thisGuild.roles = [];
            //checking if any old style entries are found (id-only)
            var stringRolesFound = false
            for (const role in thisGuild.roles)
                if (typeof(role) == 'string') stringRolesFound = true
            //convert to new object-style entry
            if (stringRolesFound){
                const newRoleList = []
                for (const stringRole of thisGuild.roles)
                    if (typeof(stringRole) == 'string') {
                        const guildRole = guild.roles.resolve(stringRole)
                        if (guildRole != null)
                            newRoleList.push({id: stringRole , name: guild.roles.resolve(stringRole).name})
                        else {
                            if (thisGuild.erroredRoles == undefined) thisGuild.erroredRoles = []
                            thisGuild.erroredRoles.push(stringRole)
                        }
                    }
                    else 
                        newRoleList.push(stringRole)
                thisGuild.roles = newRoleList
            }
            //to be continued
            if (thisGuild.roleWatches == undefined) thisGuild.roleWatches = [];
            if (thisGuild.roleToggles == undefined) thisGuild.roleToggles = [];
            if (thisGuild.defaultChannel != undefined){
                guild = bot.guilds.resolve(thisGuild.guildID);
                channel = guild.channels.resolve(thisGuild.defaultChannel);
                if (channel.type !== Discord.ChannelType.GuildText){
                    thisGuild.defaultChannel = undefined;
                }
            }
            //abandoned daily quiz
            // if (thisGuild.dailyQuiz == undefined) thisGuild.dailyQuiz = null;
            // if (thisGuild.autoQuizUpdate == undefined) thisGuild.autoQuizUpdate = false;
            // if (thisGuild.dailyQuizAnswers == undefined) thisGuild.dailyQuizAnswers = [];
            // if (thisGuild.dailyQuizManager == undefined) thisGuild.dailyQuizManager = null;
            // if (thisGuild.dailyQuizChannel == undefined) thisGuild.dailyQuizChannel = null;
            if (thisGuild.bnsRecNick == undefined) thisGuild.bnsRecNick = false
            if (thisGuild.protectFromEveryoneTag == undefined) thisGuild.protectFromEveryoneTag = false
            if (thisGuild.bnsMaintenanceChannel == undefined) thisGuild.bnsMaintenanceChannel = null
            if (thisGuild.waifuGameReminder == undefined) thisGuild.waifuGameReminder = false
            thisGuild.size = guild.memberCount
        });
        bot.guildUpdate();
        console.log("Successfully updated!");
        if (!(message == undefined || message == null)) return message.channel.send("Successfully updated!");
        return 0;
    }
}