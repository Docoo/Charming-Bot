module.exports = {
    name: "bnsstalk",
    description: "Stalk somebody, you freak",
    usage: `bnsstalk <charactername>`,
    help: `**charactername** : the name of the character you wish to stalk
            \tIf the character has been stalked before, you will see all upgrades this person made since stalking began.`,
    async execute(bot,message,args){
        const fs = require('fs');
        name = bot.sum(args);
        var request = require('sync-request');
        let url = 'https://api.silveress.ie/bns/v3/character/full/eu/' + name;
        //console.log(url);
        var bnsEquipReq = request('GET', encodeURI(url));
        bnsEquipResponse = bnsEquipReq.getBody('binary');
        bnsEquipResponseJSON = JSON.parse(bnsEquipResponse);
        //console.log(bnsEquipResponseJSON.error);
        if (!(bnsEquipResponseJSON.error == undefined))
            return message.channel.send("Character not found!");

        console.log('Character found!');
        //console.log(bot.stalking);
        while (bot.stalking != undefined){
            await bot.wait(2000);
        }
        bot.stalking = "blelele";
        let stalkJSON = JSON.parse(fs.readFileSync('./configs/stalking.json', 'utf8'));
        let found = false;
        for (let character of stalkJSON.userList){
            if (character.characterName == name){
                found = true;
            }
        }
        if (!found){
            let character = {};
            character.characterName = name;
            character.date = new Date();
            stalkJSON.userList.push(character);
            //console.log(stalkJSON);
            fs.writeFileSync('./configs/stalking.json', JSON.stringify(stalkJSON, null, 4), 'utf8');
            message.channel.send(`Character ${name} added to stalking list!`);
            bot.stalking = undefined;
            return 0;
        } else {
            let dataList = []
            
        }
        bot.stalking = undefined;
        return 0;
    }
}