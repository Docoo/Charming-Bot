module.exports={
    name: "upload",
    description: "uploads a file in response",
    async execute(bot,message,args){
        let filename = bot.sum(args);
        message.channel.send({ files: [`media\\upload\\${filename}`] });
    }
}