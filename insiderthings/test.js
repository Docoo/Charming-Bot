module.exports={
    name: "test",
    description: "",
    async execute(bot,message,args){
        // let date1 = new Date(new Date().toUTCString());
        // message.channel.send(`Date 1 is: ${date1.getMinutes()}`);
        // date2 = new Date(date1 - 1000*60*5);
        // message.channel.send(`Date 2 is: ${date2.getMinutes()}`);
        // date3 = new Date(date1 - 1000*60*30);
        // message.channel.send(`Date 3 is: ${date3.getMinutes()}`);
        // message.channel.send(`${date1 > date2}`);
        // message.channel.send("Test complete!");
        //console.log(new Date().getDay());

        switch(args[0]){
            case "1":
                const Discord = require('discord.js')
                files = []
                files.push(new Discord.AttachmentBuilder(`./assets/BD.png`))
                const newEmbed = new Discord.EmbedBuilder().setImage('attachment://BD.png')
                message.channel.send({embeds: [newEmbed], files: files})
                break;
            case "2":
                const date2 = new Date();
                const msg = "This is a test message to log to the log channel"
                logguild = bot.guilds.resolve('247831161013796865');
                logchannel = logguild.channels.resolve('642485408722190336');
                logchannel.send(`[${date2.getHours()}:${date2.getMinutes()}:${date2.getSeconds()}]\n\`\`\`${msg}\`\`\``);
                break;
            case "3":
                bot.backup_now();
                break;
            case "4":
                bot.insidercommands.get("resetweeklytrackers").execute(bot, null, null);
                break;
            case "5":
                bot.fetchBnsEquipmentFromSilveress();
                break;
            case "6":
                return message.channel.send(`${message.guild.members.resolve("1231233")}`)
                break;
            case "7":
                return message.channel.send(`${bot.guilds.resolve("1008309956610629822").memberCount}`)
                // bot.guilds.resolve("1008309956610629822").members.fetch("169525036305219585").then(member => {message.channel.send(member.user.tag)}).catch(error => {message.channel.send(error)})
                break;
            default:
                return message.reply("You did not specify a valid test case")
                break;
        }
        message.reply("Test executed successfully!")

    }
}