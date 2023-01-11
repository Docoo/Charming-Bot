module.exports ={
    name : 'dailyquizstart',
    description: `Start the automatic update of the daily quiz.`,
    usage: `dailyquizstart`,
    help: `-`,
    async execute(bot, message, args){
        if (!bot.adminOrMeCheck(message)) return message.reply("you are not allowed to use this command!");
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
            return message.channel.send('Daily quiz is already enabled! To transfer management, use \`setquizmanager\`');
        }
        thisGuild.autoQuizUpdate = true;
        thisGuild.dailyQuizManager = message.author.id;
        thisGuild.dailyQuiz = null;
        thisGuild.dailyQuizAnswers = [];
        thisGuild.dailyQuizChannel = message.channel.id;
        bot.updateGuildList();

        //manually update here

        message.channel.send(`Daily quiz started successfully, quiz manager is now ${message.author}!\nDaily quiz announcements will be posted here.`);
    }
}