module.exports = {
    name: "autobnsstalk",
    description: "Get data for all characters on the list",
    usage: `autobnsstalk`,
    help: `-`,
    async execute(bot,message,args){
        const fs = require('fs');
        var request = require('sync-request');
        let url;
        let count = 0;
        while (bot.stalking != undefined){
            await bot.wait(2000);
        }
        bot.stalking = "blelele";
        let stalkJSON = JSON.parse(fs.readFileSync('./stalking.json', 'utf8'));
        for (let character of stalkJSON.userList){
            let name = character.characterName;
            url = 'https://api.silveress.ie/bns/v3/character/full/eu/' + name;
            bnsEquipReq = request('GET', encodeURI(url));
            bnsEquipResponse = bnsEquipReq.getBody('binary');
            bnsEquipResponseJSON = JSON.parse(bnsEquipResponse);
            if (!(bnsEquipResponseJSON.error == undefined))
                console.log(`Failed to update character ${name}!`);
            let json = {};
            json.characterName = name;
            json.date = new Date();
            json.characterData = bnsEquipResponseJSON;
            stalkJSON.history.push(json);
            count++;
        }
        fs.writeFileSync('./stalking.json', JSON.stringify(stalkJSON, null, 4), 'utf8');
        console.log(`Stalking complete! Successfully stalked ${count} characters!`);
        bot.stalking = undefined;
        return 0;
    }
}