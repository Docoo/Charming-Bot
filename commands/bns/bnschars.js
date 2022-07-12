module.exports = {
    name: "bnschars",
    description: "Look up characters on a character's account",
    usage: `bnschars <charactername>`,
    help: `**charactername** : the name of a character on the account you want to look up
            \tall original characters and spaces allowed`,
    async execute(bot,message,args){


        const Discord = require('discord.js');
        name1 = sum(args, " ");
        name = name1.slice(1);

        var request = require('sync-request');
        let url = 'https://api.silveress.ie/bns/v3/character/full/eu/'+ name.replace(' ', '%20')
        var res = request('GET', encodeURI(url));
        response = res.getBody('binary');
        responseUTF8 = res.getBody('utf8');
        //console.log(response);
        data = JSON.parse(response);
        datautf8 = JSON.parse(responseUTF8);
        //console.log(data.error);
        if (!(data.error == undefined))
            return message.channel.send("Character not found!");

        let embed = new Discord.MessageEmbed()
            .setTitle(`Characters of account ${datautf8.accountName}`)
            .addField(`${getClassIcon(datautf8.playerClass, message)}${datautf8.characterName}`, 
            `Level ${datautf8.playerLevel} • HM ${datautf8.playerLevelHM}`)
            .setTimestamp(new Date() + ' | courtesy of silveress.ie');
        data.otherNames.forEach(element => {
            var res = request('GET', 'https://api.silveress.ie/bns/v3/character/full/eu/'+ element);
            response = res.getBody('utf8');
            //console.log(response);
            elemData = JSON.parse(response);
            if (! (elemData.error == undefined))
                embed.addField(element, 'Character returned error')
            else embed.addField(`${getClassIcon(elemData.playerClass, message)}${elemData.characterName}`, 
                `Level ${elemData.playerLevel} • HM ${elemData.playerLevelHM}`);
        });
        message.channel.send({embeds: [embed]});
        return 0;
    }
}



function sum(theArgs, spacer) {
    var i=0;
    var mystring = '';
    while (true){
        if (typeof theArgs[i] === "undefined") break;
        mystring += spacer + theArgs[i].toString();
        i++;
    }
    return mystring;
}

function getClassIcon(name, message){
    if (name == "Blade Dancer") return message.client.emojis.cache.find(emoji => emoji.name === "BD");
    if (name == "Blade Master") return message.client.emojis.cache.find(emoji => emoji.name === "BM");
    if (name == "Destroyer") return message.client.emojis.cache.find(emoji => emoji.name === "DES");
    if (name == "Force Master") return message.client.emojis.cache.find(emoji => emoji.name === "FM");
    if (name == "Gunner") return message.client.emojis.cache.find(emoji => emoji.name === "GUN");
    if (name == "Kung Fu Master") return message.client.emojis.cache.find(emoji => emoji.name === "KFM");
    if (name == "Soul Fighter") return message.client.emojis.cache.find(emoji => emoji.name === "SF");
    if (name == "Assassin") return message.client.emojis.cache.find(emoji => emoji.name === "SIN");
    if (name == "Summoner") return message.client.emojis.cache.find(emoji => emoji.name === "SUM");
    if (name == "Warlock") return message.client.emojis.cache.find(emoji => emoji.name === "WL");
    if (name == "Warden") return message.client.emojis.cache.find(emoji => emoji.name === "WRD");
}