module.exports={
    name: "test2",
    description: "",
    async execute(bot,message,args){
        console.log(bot.dailyGuildQuiz);
        message.channel.send("test2 executed");
        return 0;
    }
}