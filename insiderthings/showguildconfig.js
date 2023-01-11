module.exports = {
    name: 'showguildconfig',
    description: 'Exactlywhatitsays',
    async execute(bot, message, args){
        if (message.author.id == "169525036305219585")
            message.channel.send("```\n"+JSON.stringify(bot.guildList.find(guild => guild.guildID == args[0]), null, 4)+"\n```")
    }
}