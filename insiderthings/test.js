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

        const Discord = require('Discord.js')
        files = []
        files.push(new Discord.MessageAttachment(`./assets/BD.png`))
        const newEmbed = new Discord.MessageEmbed().setImage('attachment://BD.png')
        message.channel.send({embeds: [newEmbed], files: files})
    }
}