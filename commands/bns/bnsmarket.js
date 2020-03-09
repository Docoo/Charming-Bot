module.exports = {
    name: "bnsmarket",
    description: "Search an item on the in-game market",
    usage: `bnsmarket <itemname>`,
    help: `**itemname** : the name of the item to search in F5
            \tcan be exact match or partial`,
    execute(bot,message,args){
        const Discord = require('discord.js');
        const fs = require('fs');
        let bnsGoldCoin = bot.emojis.find(emoji => emoji.name === "bnsGoldCoin");
        let bnsSilverCoin = bot.emojis.find(emoji => emoji.name === "bnsSilverCoin");
        let bnsCopperCoin = bot.emojis.find(emoji => emoji.name === "bnsCopperCoin");
        if (args[0] == undefined){
            return message.channel.send("No item name provided!");
        }
        let itemToSearchFor = bot.sum(args);
        
        var request = require('sync-request');

        // let url = 'https://api.silveress.ie/bns/v3/items';
        // var itemListRequest = request('GET', encodeURI(url));
        // var itemListResponse = itemListRequest.getBody('utf8');
        // if (!(itemListResponse.error == undefined))
        //     return message.channel.send("Server currently unavailable!");
        // let itemList = JSON.parse(itemListResponse);
        // console.log(itemList);
        let item = null;
        //replace bot.bnsitems with itemList when fetching from web
        for (let each of bot.bnsitems){
            //console.log(each);
            if (each.name.toLowerCase() == itemToSearchFor.toLowerCase()){
                item = each;
                break;
            }
            if (each.name.toLowerCase().includes(itemToSearchFor.toLowerCase()) && (item == null)){
                item = each;
            }
        }
        if (item == null){
            return message.channel.send("Item not found in the database! (check spelling or untradeable)");
        }
        console.log(item.name, " ", item.id);
        //message.channel.send(`Item name: ${item.name}, id: ${item.id}`);

        let exists = true;
        let url = 'https://api.silveress.ie/bns/v3/market/eu/current/' + item.id;
        var marketListRequest = request('GET', encodeURI(url));
        var marketListResponse = marketListRequest.getBody('utf8');
        if (!(marketListResponse.error == undefined))
            return message.channel.send("Server currently unavailable!");
        let marketList = JSON.parse(marketListResponse);
        let marketHistory = undefined;
        //console.log(marketList);
        if (marketList.toString() == []){
            exists = false;
            let url = 'https://api.silveress.ie/bns/v3/market/eu/history/' + item.id;
            var marketHistoryRequest = request('GET', encodeURI(url));
            var marketHistoryResponse = marketHistoryRequest.getBody('utf8');
            if (!(marketHistoryResponse.error == undefined))
                return message.channel.send("Server currently unavailable!");
            marketHistory = JSON.parse(marketHistoryResponse);
            //console.log(marketList);
        }

        let embed = new Discord.RichEmbed()
        .setTitle(item.name)
        .setThumbnail(item.img)
        .setTimestamp(new Date() + ' | courtesy of silveress.ie');

        if (exists == true){
            let listings = marketList[0].listings;
            embed.setDescription(`${marketList[0].totalListings} offers found!`);
            let count = 5;
            while (listings.length > 0 && count > 0){
                count--;
                let listing = listings.shift();
                embed.addField(`${listing.count} items registered`,
                    `${Math.floor(listing.each/10000)>1 ? Math.floor(listing.each/10000) : 0}${bnsGoldCoin}${Math.floor(listing.each%10000/100) > 1 ? Math.floor(listing.each%10000/100) : 0}${bnsSilverCoin}${listing.each%100}${bnsCopperCoin} each, for a total of ${Math.floor(listing.price/10000) > 1 ? Math.floor(listing.price/10000) : 0}${bnsGoldCoin}${Math.floor(listing.price%10000/100) > 1 ? Math.floor(listing.price%10000/100) : 0}${bnsSilverCoin}${listing.price%100}${bnsCopperCoin}`, false);
            }
        } else {
            let listing = marketHistory[0].listings[0];
            embed.setDescription(`No current listings found!`)
            .addField(`Historical value:`, `${Math.floor(listing.each/10000) > 1 ? Math.floor(listing.each/10000) : 0}${bnsGoldCoin}${Math.floor(listing.each%10000/100) > 1 ? Math.floor(listing.each%10000/100) : 0}${bnsSilverCoin}${listing.each%100}${bnsCopperCoin} each`);
        }
            
        message.channel.send(embed);

        return 0;
    }
}