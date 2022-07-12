module.exports ={
    name : 'dailyquizstop',
    description: `Stop the automatic update of the daily quiz.`,
    usage: `dailyquizstop`,
    help: `-`,
    async execute(bot, message, args){
        if ((!message.member.permissions.has('ADMINISTRATOR')) && (message.author.id != '169525036305219585')){
            return message.reply("you are not allowed to use this command!");
        };
        let thisGuild = message.channel.guild.id;
        for (let guild of bot.guildList){
            if (guild.guildID == thisGuild){
                thisGuild = guild;
            }
        }
        if (thisGuild == message.channel.guild.id){
            return message.channel.send('Guild error (missing config entry).')
        }
        if (thisGuild.autoQuizUpdate == false){
            return message.channel.send('Daily quiz is already disabled!');
        }
        if ((thisGuild.dailyQuizManager != message.author.id) && (!message.member.permissions.has('ADMINISTRATOR')) && (message.author.id != '169525036305219585')){
            return message.channel.send('Someone else is managing the daily quiz!');
        }
        thisGuild.autoQuizUpdate = false;
        thisGuild.dailyQuizManager = null;
        bot.updateGuildList();
        message.channel.send(`Daily quiz disabled successfully! If you wish to process the last question, do so with the command \`**soonTM**\``);
    }
}