module.exports = {
    name: 'getserverconfig',
    description: 'Exactlywhatitsays',
    async execute(bot, message, args){
        if (message.author.id == "169525036305219585"){
            const stringToSend = JSON.stringify(bot.guildList.find(guild => guild.guildID == args[0]), null, 4)
            if (stringToSend.length < 3000)
                message.channel.send("```\n"+stringToSend+"\n```")
            else {
                const lines = stringToSend.split('\n')
                var someLines = ""
                while (lines.length > 0){
                    someLines += lines.shift() + '\n'
                    if (someLines.length > 3000){
                        message.channel.send("```\n"+someLines+"\n```")
                        someLines = ""
                    }
                }
                if (someLines != "") 
                    message.channel.send("```\n"+someLines+"\n```")
            }
        }
    }
}