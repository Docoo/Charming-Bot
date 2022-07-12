module.exports={
    name: "test2",
    description: "",
    async execute(bot,message,args){

        message.channel.send(`Last BnS server status was: ${bot.bnsServerStatus.toString()}`)

        return 0;
    }
}