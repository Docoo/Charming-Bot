module.exports = {
    name: 'addquizquestion',
    description: `Adds a question to this guild's list of questions for the daily quiz.`,
    usage: `addquizquestion <question>`,
    help: `**question** : the question that will be posted in the default channel and
            that the users have to answer`,
    async execute(bot, message, args){
        //.hasPermission('ADMINISTRATOR')
        if (!bot.adminOrMeCheck(message)) return message.reply("you are not allowed to use this command!");
        let data = bot.sum(args);
        if (data == ""){
            return message.channel.send("No question provided or improper use of quotations.");
        }
        let question = {};
        //console.log(bot.dailyGuildQuiz);
        question.question_id = bot.dailyGuildQuiz.next_id;
        bot.dailyGuildQuiz.next_id++;
        question.question_text = data;
        question.winner = null;
        let server_id = message.channel.guild.id;
        let serverPool = undefined;
        //console.log(bot.dailyGuildQuiz);
        for (index of bot.dailyGuildQuiz.list){
            //console.log(index);
            if (index.server_id == server_id){
                serverPool = index;
                index.questionPool.push(question);
            }
        }
        if (serverPool == undefined){
            let serverPool = {};
            serverPool.server_id = server_id;
            serverPool.questionPool = [];
            serverPool.questionPool.push(question);
            bot.dailyGuildQuiz.list.push(serverPool);
        }
        bot.updateGuildQuiz();
        message.reply(`question \"${question.question_text}\" was added successfully!`);
        return 0;
    }
}