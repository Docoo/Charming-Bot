module.exports={
    name: "setavatar",
    description: "",
    async execute(bot,message,args){
        let name = args.shift();
        bot.user.setAvatar('./assets/bot_profile_pics/' + name);
        message.channel.send("Avatar changed successfully!");
        return 0;
    }
}
