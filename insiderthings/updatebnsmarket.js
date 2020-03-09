module.exports = {
    name: "updatebnsmarket",
    description: 'Updates list of items on F5',
    usage: 'updatebnsmarket',
    help: '-',
    execute(bot, message, args){
        const request = require('sync-request');
        url ='https://api.silveress.ie/bns/v3/items'
        let silveressCharacterReq;
        let silveressCharacterResponse;
        try {
            silveressCharacterReq = request('GET', encodeURI(url), {
                timeout : 20000
            });
            silveressCharacterResponse = silveressCharacterReq.getBody('utf8');
        } catch (err) {
            console.log(err);
            return message.channel.send("An error has occured! Code: " + err.code);
        }
        if (silveressCharacterResponse.includes("Error: Request timed out after") || 
        silveressCharacterResponse.includes("502: Bad G")){
            //console.log(silveressCharacterResponse.Error);
            //console.log(here);
            return message.channel.send("Request failed!");
        }
        var list = JSON.parse(silveressCharacterResponse);
        const fs = require('fs');
        fs.writeFileSync('./bnsitems.json', silveressCharacterResponse, 'utf8');
        bot.bnsitems = JSON.parse(fs.readFileSync('./bnsitems.json'));
        message.channel.send('Item list successfully updated!');
    }
}