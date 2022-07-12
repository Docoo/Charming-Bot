module.exports ={
    name : 'setquizmanager',
    description: `Set who manages the daily quiz (cannot participate).`,
    usage: `setquizmanager <user>`,
    help: `**user** : can be a username, mention or partial name (first fit is used on partial)`,
    async execute(bot, message, args){
        if ((!message.member.permissions.has('ADMINISTRATOR')) && (message.author.id != '169525036305219585')){
            return message.reply("you are not allowed to use this command!");
        };
        let myUser = null;
        const member = message.mentions.members.first();
        //console.log(member);
        const name = bot.sum(args);
        if (member != undefined){
            myUser = member;
        } else {
            for (let user of message.channel.guild.members){
                user = user[1];
                //console.log(user);
                if (user.displayName.toLowerCase() == name.toLowerCase() || user.user.username.toLowerCase() == name.toLowerCase()){
                    myUser = user;
                    break;
                }
            }
            if (myUser == null){
                for (let user of message.channel.guild.members){
                    user = user[1];
                    if (user.displayName.toLowerCase().includes(name.toLowerCase()) || user.user.username.toLowerCase().includes(name.toLowerCase())){
                        myUser = user;
                        break;
                    }
                }
            }
        }
        if (myUser != null){
            let thisGuild = message.channel.guild.id;
            for (let guild of bot.guildList){
                if (guild.guildID == thisGuild){
                    thisGuild = guild;
                }
            }
            if (thisGuild == message.channel.guild.id){
                return message.channel.send('Guild error (missing config entry).')
            }
            if (thisGuild.autoQuizUpdate == false){
                return message.channel.send('Daily quiz is disabled!');
            }
            thisGuild.dailyQuizManager = myUser.id;
            return message.channel.send(`${myUser} is now the quiz manager!`);
        } else {
            return message.channel.send('No such user could be found!');
        }
    }
}