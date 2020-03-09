module.exports={
    name: "setactivity",
    description: "",
    async execute(bot,message,args){
        let type = args.shift();
        let content = bot.sum(args);
        bot.user.setActivity(content, {type: type.toUpperCase(), state: content});
        message.channel.send("Status set to: " + content);
        return 0;
    }
}