module.exports = {
    name: "bnsrecnick",
    description: "Swaps username usage in recruitments to nickname usage.",
    usage: `bnsrecnick`,
    help: `It's a toggle :)`,
    async execute(bot,message,args){
        if ((!message.member.permissions.has('ADMINISTRATOR')) && (message.author.id != '169525036305219585')){
            return message.reply("you are not allowed to use this command!");
        };
        for (let thisGuild of bot.guildList){
            if (thisGuild.guildID == message.channel.guild.id){
                if (thisGuild.bnsRecNick == false){
                    thisGuild.bnsRecNick = true;
                    bot.updateGuildList();
                    message.channel.send('Successfully swapped to nickname usage!');
                } else {
                    thisGuild.bnsRecNick = false;
                    bot.updateGuildList();
                    message.channel.send('Successfully swapped to username usage!');
                }
            }
        }
    }
}