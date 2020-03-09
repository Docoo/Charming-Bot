module.exports={
    name: "test",
    description: "",
    async execute(bot,message,args){
        message.channel.send(bot.sum(args) + " amor perdu!");
        return 0;
    }
}