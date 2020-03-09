module.exports = {
    name: 'removequizquestion',
    description: `Removes the last question added to the server's question pool.`,
    usage: `removequizquestion`,
    help: `-`,
    async execute(bot, message, args){
        //.hasPermission('ADMINISTRATOR')
        if ((!message.member.hasPermission('ADMINISTRATOR')) && (message.author.id != '169525036305219585')){
            return message.reply("you are not allowed to use this command!");
        };
        let server_id = message.channel.guild.id;
        let serverPool = undefined;
        let question = '';
        for (index of bot.dailyGuildQuiz.list){
            //console.log(index);
            if (index.server_id == server_id){
                serverPool = index;
                if (serverPool.questionPool.length == 0){
                    return message.channel.send("There are no questions left to delete!");
                } else {
                    question = serverPool.questionPool.splice(serverPool.questionPool.length-1, 1)[0];
                    bot.updateGuildQuiz();
                    message.reply(`question \"${question.question_text}\" was deleted successfully!`);
                }
            }
        }
        return 0;
    }
}