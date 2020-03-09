module.exports = {
    name: "bnslookup",
    description: "Look up character data",
    usage: `bnslookup <charactername>`,
    help: `**charactername** : the name of the character you wish to look up
            \tall original characters and spaces allowed`,
    execute(bot,message,args){
        const cheerio = require('cheerio');
        const Discord = require('discord.js');
        const fs = require('fs');
        name1 = sum(args);
        name = name1.slice(0, -1);
        var request = require('sync-request');
        let url = 'http://eu-bns.ncsoft.com/ingame/bs/character/data/equipments?c=' + name;
        var bnsEquipReq = request('GET', encodeURI(url));
        bnsEquipResponse = bnsEquipReq.getBody('binary');
        bnsEquipResponseUTF8 = bnsEquipReq.getBody('utf8');
        if (!(bnsEquipResponse.error == undefined))
            return message.channel.send("Character not found!");

        console.log('Character found!');
        let $ = cheerio.load(bnsEquipResponse);
        let weapSrc = $('.wrapWeapon .icon .thumb img');
        let weapUrl = weapSrc.attr("src");

        url ='https://api.silveress.ie/bns/v3/character/full/eu/' + name;
        var silveressCharacterReq;
        var silveressCharacterResponse;
        try {
            silveressCharacterReq = request('GET', encodeURI(url), {
                timeout : 5000
            });
            silveressCharacterResponse = silveressCharacterReq.getBody('binary');
        } catch (err) {
            console.log("Timeout error");
            return message.channel.send("Character found, but failed to load data!");
        }
        if (silveressCharacterResponse.includes("Error: Request timed out after") || 
        silveressCharacterResponse.includes("502: Bad G")){
            //console.log(silveressCharacterResponse.Error);
            //console.log(here);
            return message.channel.send("Character found, but data could not be loaded!");
        }
        var characterData = JSON.parse(silveressCharacterResponse);
        //console.log(characterData);
        console.log('Character data aquired!');

        let weapName = '';
        if (weapUrl != undefined){
            weapName = weapUrl.split('/');
            weapName = weapName[weapName.length - 1];
        }
        
        var accTxt = '';
        if (characterData.weaponName != ''){
            accTxt += characterData.weaponName + '\n';
        }
        if (characterData.ringName != ''){
            accTxt += characterData.ringName + '\n';
        }
        if (characterData.earringName != ''){
            accTxt += characterData.earringName + '\n';
        }
        if (characterData.necklaceName != ''){
            accTxt += characterData.necklaceName + '\n';
        }
        if (characterData.braceletName != ''){
            accTxt += characterData.braceletName + '\n';
        }
        if (characterData.beltName != ''){
            accTxt += characterData.beltName + '\n';
        }
        if (characterData.gloves != ''){
            accTxt += characterData.gloves + '\n';
        }
        if (characterData.soulName != ''){
            accTxt += characterData.soulName + '\n';
        }
        if (characterData.soulName2 != ''){
            accTxt += characterData.soulName2 + '\n';
        }
        if (characterData.petAuraName != ''){
            accTxt += characterData.petAuraName + '\n';
        }
        if (characterData.talismanName != ''){
            accTxt += characterData.talismanName + '\n';
        }
        if (characterData.soulBadgeName != ''){
            accTxt += characterData.soulBadgeName + '\n';
        }
        if (characterData.mysticBadgeName != ''){
            accTxt += characterData.mysticBadgeName + '\n';
        }

        const BD = message.client.emojis.find(emoji => emoji.name === "BD");
        const BM = message.client.emojis.find(emoji => emoji.name === "BM");
        const DES = message.client.emojis.find(emoji => emoji.name === "DES");
        const FM = message.client.emojis.find(emoji => emoji.name === "FM");
        const GUN = message.client.emojis.find(emoji => emoji.name === "GUN");
        const KFM = message.client.emojis.find(emoji => emoji.name === "KFM");
        const SF = message.client.emojis.find(emoji => emoji.name === "SF");
        const SIN = message.client.emojis.find(emoji => emoji.name === "SIN");
        const SUM = message.client.emojis.find(emoji => emoji.name === "SUM");
        const WL = message.client.emojis.find(emoji => emoji.name === "WL");
        const WRD = message.client.emojis.find(emoji => emoji.name === "WRD");
        const ARC = message.client.emojis.find(emoji => emoji.name === "ARC");
        var charClass = '';
        switch (characterData.playerClass) {
            case 'Blade Dancer':
                charClass = BD;
                break;
            case 'Blade Master':
                charClass = BM;
                break;
            case 'Destroyer':
                charClass = DES;
                break;
            case 'Force Master':
                charClass = FM;
                break;
            case 'Gunner':
                charClass = GUN;
                break;
            case 'Kung Fu Master':
                charClass = KFM;
                break;
            case 'Soul Fighter':
                charClass = SF;
                break;
            case 'Assassin':
                charClass = SIN;
                break;
            case 'Summoner':
                charClass = SUM;
                break;
            case 'Warlock':
                charClass = WL;
                break;
            case 'Warden':
                charClass = WRD;
                break;
            case 'Zen Archer':
                charClass = ARC;
                break;
            default:
                break;
        }
        let filenamee = '';
        let f2picurl = characterData.officialImg;
        if (f2picurl == undefined) f2picurl = characterData.characterImg;
        if (f2picurl == undefined){
            console.log('F2pic url error');
            //console.log(characterData);
            //return message.channel.send('Character profile picture error!');
        } else {
            let f2picname = f2picurl.split('/');
            let extension = f2picname[f2picname.length-1].split('.');
            extension = extension[extension.length-1];
            //console.log('Extension: '+extension);
            filenamee = escape(name).replace('%','')+'.'+extension;
            filenamee = filenamee.replace(' ', '_');
            try{
                var imgRequest = request('GET', f2picurl);
                fs.writeFileSync('./f2pics/'+filenamee, imgRequest.getBody('binary'), 'binary');
                console.log('./f2pics/'+filenamee);
                console.log('Picture aquired!');
            } catch (error) {
                console.log('Failed to fetch picture! (url=\"' + f2picurl + '\")');
                f2picurl = undefined;
            }
        }
        url = 'http://eu-bns.ncsoft.com/ingame/bs/character/data/abilities.json?c=' + name;
        var attributeRequest = request('GET', encodeURI(url));
        var attributeBody = attributeRequest.getBody('utf8');
        var attributes = JSON.parse(attributeBody);
        console.log('Attributes aquired!');
        if (attributes.result == "fail") return message.channel.send("Character not found!");
        var generalInfo = '**Server:** ' + characterData.server + '\n' +
            '**Clan:** ' + characterData.guild +  '\n' +
            '**Level:** ' + characterData.playerLevel + ' ■ ' +
            '**HM Level:** ' + characterData.playerLevelHM;
        var mysticStats = '**Mystic:** ' + attributes.records.total_ability.attack_attribute_value + 
            '\n**Mystic damage:** ' + attributes.records.total_ability.attack_attribute_rate + '%\n' + 
            message.client.emojis.find(emoji => emoji.name == "Magic1");
        var offensive = '**Attack:** ' + attributes.records.total_ability.attack_power_value +
            ' ' + message.client.emojis.find(emoji => emoji.name == "ap_icon") + ' ' +
            attributes.records.point_ability.offense_point+'P\n'+
            message.client.emojis.find(emoji => emoji.name == "threat_icon") + ' ' +
            attributes.records.point_ability.picks[0].point+'P '+
            message.client.emojis.find(emoji => emoji.name == "focus_icon") + ' '+ 
            attributes.records.point_ability.picks[3].point+'P\n'+
            '**Pierce:** ' + attributes.records.total_ability.attack_pierce_value+
            ' ('+attributes.records.total_ability.attack_defend_pierce_rate+'%)\n'+
            '**Accuracy:** ' + attributes.records.total_ability.attack_hit_value+
            ' ('+attributes.records.total_ability.attack_hit_rate+'%)\n'+
            '**Critical:** ' + attributes.records.total_ability.attack_critical_value+
            ' ('+attributes.records.total_ability.attack_critical_rate+'%)\n'+
            '**Critical damage:** ' + attributes.records.total_ability.attack_critical_damage_value+
            ' ('+attributes.records.total_ability.attack_critical_damage_rate+'%)\n';
        var defence = '**HP:** ' + attributes.records.total_ability.max_hp + ' ' + 
            message.client.emojis.find(emoji => emoji.name == "defense_icon") + ' ' +
            attributes.records.point_ability.defense_point+'P\n'+
            message.client.emojis.find(emoji => emoji.name == "regen_icon") + ' ' +
            attributes.records.point_ability.picks[1].point+'P ' +
            message.client.emojis.find(emoji => emoji.name == "evade_icon") + ' ' +
            attributes.records.point_ability.picks[2].point+'P ' +
            message.client.emojis.find(emoji => emoji.name == "stun_icon") + ' ' +
            attributes.records.point_ability.picks[4].point+'P\n'+
            '**Defense:** ' + attributes.records.total_ability.defend_power_value+
            ' ('+attributes.records.total_ability.defend_physical_damage_reduce_rate+'%)\n'+
            '**Evasion:** ' + attributes.records.total_ability.defend_dodge_value+
            ' ('+attributes.records.total_ability.defend_dodge_rate+'%)\n'+
            '**Block:** ' + attributes.records.total_ability.defend_parry_value+
            ' ('+attributes.records.total_ability.defend_parry_rate+'%)\n'+
            '**Crit Defense:** ' + attributes.records.total_ability.defend_critical_value +
            ' ('+attributes.records.total_ability.defend_critical_damage_rate+'%)';
        //console.log(attributes.records.point_ability.picks);
        var randomColor = "000000".replace(/0/g,function(){return (~~(Math.random()*16)).toString(16);});
        var attpwr = attributes.records.total_ability.attack_power_value;
        var exampleEmbed = new Discord.RichEmbed()
            .setTitle(`${charClass}${characterData.accountName}[${name}]`)
            .setURL('http://eu-bns.ncsoft.com/ingame/bs/character/profile?c='+ name.replace(' ', '%20'))
            .setDescription('AP: ' + attpwr)
            .addField('__General Info:__', generalInfo, true)
            .addField('__Mystic damage:__', mysticStats, true)
			.addBlankField(false)
            .addField('__Offensive:__', offensive, true)
            .addField('__Defense:__', defence, true)
            .addField('__Equipment:__', accTxt, false)
            .setColor(randomColor)
            .setTimestamp(new Date() + ' | courtesy of silveress.ie');

        if (f2picurl != undefined){
            exampleEmbed.attachFiles([weapUrl, './f2pics/'+filenamee])
            .setImage('attachment://'+filenamee)
            .setThumbnail('attachment://'+weapName);
        } else {
            exampleEmbed
            .attachFile(weapUrl)
            .setThumbnail('attachment://'+weapName);
        }

        if (attpwr<1800){
            lollipop = message.client.emojis.find(emoji => emoji.name == "AkariHug");
            exampleEmbed.addField('Whale meter: ', 'loli'+lollipop);
        } else if (attpwr<1900){
            gasmlove = message.client.emojis.find(emoji => emoji.name == "GasmLove");
            exampleEmbed.addField('Whale meter: ', 'lolita'+gasmlove);
        } else if (attpwr<2000){
            dolphin = message.client.emojis.find(emoji => emoji.name == "NanachiSmug");
            exampleEmbed.addField('Whale meter: ', 'dolphin'+dolphin);
        } else if (attpwr<2200){
            whale = message.client.emojis.find(emoji => emoji.name == "HyperYay");
            exampleEmbed.addField('Whale meter: ', 'whale'+whale);
        } else if (attpwr<2400){
            whale = message.client.emojis.find(emoji => emoji.name == "HyperYay");
            exampleEmbed.addField('Whale meter: ', 'WHALE'+whale+whale+whale);
        } else if (attpwr>2400){
            whale = message.client.emojis.find(emoji => emoji.name == "HyperYay");
            exampleEmbed.addField('Whale meter: ', 'WHALE!!! '+whale+whale+whale+whale+whale+whale);
        }
        //console.log(exampleEmbed);
        message.channel.send(exampleEmbed);
        //console.log(weapName);
        console.log('Success!');
        return 0;
    }
}

function sum(theArgs) {
    var i=0;
    var mystring = '';
    while (true){
        if (typeof theArgs[i] === "undefined") break;
        mystring += theArgs[i].toString() + " ";
        i++;
    }
    return mystring;
}

function whale(bot, message, args, exampleEmbed, attpwr){
    if (attpwr<1800){
        lollipop = message.client.emojis.find(emoji => emoji.name == "AkariHug");
        exampleEmbed.addField('Whale meter: ', 'loli'+lollipop);
    } else if (attpwr<1900){
        gasmlove = message.client.emojis.find(emoji => emoji.name == "GasmLove");
        exampleEmbed.addField('Whale meter: ', 'lolita'+gasmlove);
    } else if (attpwr<2000){
        dolphin = message.client.emojis.find(emoji => emoji.name == "NanachiSmug");
        exampleEmbed.addField('Whale meter: ', 'dolphin'+dolphin);
    } else if (attpwr<2200){
        whale = message.client.emojis.find(emoji => emoji.name == "HyperYay");
        exampleEmbed.addField('Whale meter: ', 'whale'+whale);
    } else if (attpwr<2400){
        whale = message.client.emojis.find(emoji => emoji.name == "HyperYay");
        exampleEmbed.addField('Whale meter: ', 'WHALE'+whale+whale+whale);
    } else if (attpwr>2400){
        whale = message.client.emojis.find(emoji => emoji.name == "HyperYay");
        exampleEmbed.addField('Whale meter: ', 'WHALE!!! '+whale+whale+whale+whale+whale+whale);
    }
}