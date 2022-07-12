module.exports ={
    name : 'processdailyquiz',
    description: `Used to process the current daily question manually`,
    usage: `processdailyquiz`,
    help: `-`,
    async execute(bot, message, args){
        if (message == null){
            //automated stuff
        } else {
            //human stuff
            let thisGuild = message.channel.guild.id;
            for (let guild of bot.guildList){
                if (guild.guildID == thisGuild){
                    thisGuild = guild;
                }
            }
            if (thisGuild == message.channel.guild.id){
                return message.channel.send('Guild error (missing config entry).')
            }
            if (thisGuild.autoQuizUpdate == true){
                return message.channel.send('Daily Quiz automatic processing is on! (disable using \`dailyQuizStop\` to be able to process manually)');
            }
            if ((!message.member.permissions.has('ADMINISTRATOR')) && (message.author.id != '169525036305219585') && (thisGuild.dailyQuizManager != message.author.id)){
                return message.reply("you are not allowed to use this command!");
            };
        }
    }
}