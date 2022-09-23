module.exports = {
    name: "bnslookup",
    description: "Look up character data",
    usage: `bnslookup <charactername>`,
    help: `**charactername** : the name of the character you wish to look up
            \tall original characters and spaces allowed`,
    execute(bot,message,args){
        //const cheerio = require('cheerio');
        const Discord = require('discord.js');
        const fs = require('fs');
        name1 = sum(args);
        characterName = name1.slice(0, -1);
        var request = require('sync-request');
        let url;

        // console.log('Character found!');
        // let $ = cheerio.load(bnsEquipResponse);
        // let weapSrc = $('.wrapWeapon .icon .thumb img');
        // let weapUrl = weapSrc.attr("src");

        url ='https://api.silveress.ie/bns/v4/character/eu/' + characterName;
        var silveressCharacterReq;
        var silveressCharacterResponse;
        try {
            silveressCharacterReq = request('GET', encodeURI(url), {
                timeout : 5000
            });
            silveressCharacterResponse = silveressCharacterReq.getBody('binary');
        } catch (err) {
            console.log("Silveress error");
            return message.channel.send("Error reaching silveress API server");
        }
        if (silveressCharacterResponse.error.includes("not found")){
            console.log(`Character ${characterName} not found!`)
            return message.channel.send(`Character ${characterName} not found!`)
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
        let weapUrl
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

        const BD = message.client.emojis.cache.find(emoji => emoji.name === "BD").toString();
        const BM = message.client.emojis.cache.find(emoji => emoji.name === "BM").toString();
        const DES = message.client.emojis.cache.find(emoji => emoji.name === "DES").toString();
        const FM = message.client.emojis.cache.find(emoji => emoji.name === "FM").toString();
        const GUN = message.client.emojis.cache.find(emoji => emoji.name === "GUN").toString();
        const KFM = message.client.emojis.cache.find(emoji => emoji.name === "KFM").toString();
        const SF = message.client.emojis.cache.find(emoji => emoji.name === "SF").toString();
        const SIN = message.client.emojis.cache.find(emoji => emoji.name === "SIN").toString();
        const SUM = message.client.emojis.cache.find(emoji => emoji.name === "SUM").toString();
        const WL = message.client.emojis.cache.find(emoji => emoji.name === "WL").toString();
        const WRD = message.client.emojis.cache.find(emoji => emoji.name === "WRD").toString();
        const ARC = message.client.emojis.cache.find(emoji => emoji.name === "ARC").toString();
        const AST = message.client.emojis.cache.find(emoji => emoji.name === "AST").toString();
        var charClass = '';
        switch (characterData.base_info.class_name) {
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
            case 'Astromancer':
                charClass = AST;
                break;
            default:
                break;
        }
        let filenamee = '';
        let f2picurl = characterData.base_info.profile_url;
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
            filenamee = escape(characterName).replace('%','')+'.'+extension;
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
        // url = 'http://eu-bns.ncsoft.com/ingame/bs/character/data/abilities.json?c=' + characterName;
        // var attributeRequest = request('GET', encodeURI(url));
        // var attributeBody = attributeRequest.getBody('utf8');
        // var attributes = JSON.parse(attributeBody);
        // console.log('Attributes aquired!');
        // if (attributes.result == "fail") return message.channel.send("Character not found!");
        var generalInfo = '**Server:** ' + characterData.server_name + '\n' +
            '**Clan:** ' + characterData.guild.guild_name +  '\n' +
            '**Level:** ' + characterData.level + ' ■ ' +
            '**HM Level:** ' + characterData.mastery_level;
        var mysticStats = '**Mystic:** ' + characterData.abilities.total_ability.attack_attribute_value + 
            '\n**Mystic damage:** ' + characterData.abilities.total_ability.attack_attribute_rate + '%\n' + 
            message.client.emojis.cache.find(emoji => emoji.name == "Magic1").toString();
        var offensive = '**Attack:** ' + characterData.abilities.total_ability.attack_power_value +
            ' ' + message.client.emojis.cache.find(emoji => emoji.name == "ap_icon").toString() + ' ' +
            characterData.abilities.point_ability.offense_point+'P\n'+
            message.client.emojis.cache.find(emoji => emoji.name == "threat_icon").toString() + ' ' +
            characterData.abilities.point_ability.picks[0].point+'P '+
            message.client.emojis.cache.find(emoji => emoji.name == "focus_icon").toString() + ' '+ 
            characterData.abilities.point_ability.picks[3].point+'P\n'+
            '**Pierce:** ' + characterData.abilities.total_ability.attack_pierce_value+
            ' ('+characterData.abilities.total_ability.attack_defend_pierce_rate+'%)\n'+
            '**Accuracy:** ' + characterData.abilities.total_ability.attack_hit_value+
            ' ('+characterData.abilities.total_ability.attack_hit_rate+'%)\n'+
            '**Critical:** ' + characterData.abilities.total_ability.attack_critical_value+
            ' ('+characterData.abilities.total_ability.attack_critical_rate+'%)\n'+
            '**Critical damage:** ' + characterData.abilities.total_ability.attack_critical_damage_value+
            ' ('+characterData.abilities.total_ability.attack_critical_damage_rate+'%)\n';
        var defence = '**HP:** ' + characterData.abilities.total_ability.max_hp + ' ' + 
            message.client.emojis.cache.find(emoji => emoji.name == "defense_icon").toString() + ' ' +
            characterData.abilities.point_ability.defense_point+'P\n'+
            message.client.emojis.cache.find(emoji => emoji.name == "regen_icon").toString() + ' ' +
            characterData.abilities.point_ability.picks[1].point+'P ' +
            message.client.emojis.cache.find(emoji => emoji.name == "evade_icon").toString() + ' ' +
            characterData.abilities.point_ability.picks[2].point+'P ' +
            message.client.emojis.cache.find(emoji => emoji.name == "stun_icon").toString() + ' ' +
            characterData.abilities.point_ability.picks[4].point+'P\n'+
            '**Defense:** ' + characterData.abilities.total_ability.defend_power_value+
            ' ('+characterData.abilities.total_ability.defend_physical_damage_reduce_rate+'%)\n'+
            '**Evasion:** ' + characterData.abilities.total_ability.defend_dodge_value+
            ' ('+characterData.abilities.total_ability.defend_dodge_rate+'%)\n'+
            '**Block:** ' + characterData.abilities.total_ability.defend_parry_value+
            ' ('+characterData.abilities.total_ability.defend_parry_rate+'%)\n'+
            '**Crit Defense:** ' + characterData.abilities.total_ability.defend_critical_value +
            ' ('+characterData.abilities.total_ability.defend_critical_damage_rate+'%)';
        //console.log(attributes.records.point_ability.picks);
        var randomColor = "000000".replace(/0/g,function(){return (~~(Math.random()*16)).toString(16);});
        var attpwr = characterData.abilities.total_ability.attack_power_value;
        var exampleEmbed = new Discord.MessageEmbed()
            .setTitle(`${charClass}${characterData.accountName}[${characterName}]`)
            .setURL('http://eu-bns.ncsoft.com/ingame/bs/character/profile?c='+ characterName.replace(' ', '%20'))
            .setDescription('AP: ' + attpwr)
            .addField('__General Info:__', generalInfo, true)
            .addField('__Mystic damage:__', mysticStats, true)
			.addField('\u200B','\u200B', false)
            .addField('__Offensive:__', offensive, true)
            .addField('__Defense:__', defence, true)
            .addField('__Equipment:__', accTxt, false)
            .setColor(randomColor)
            .setTimestamp(new Date() + ' | courtesy of silveress.ie');
        const files = [];
        if (f2picurl != undefined){
            files.push(new Discord.MessageAttachment(`${weapUrl}`))
            files.push(new Discord.MessageAttachment('./f2pics/'+filenamee))
            exampleEmbed.setImage('attachment://'+filenamee)
                .setThumbnail('attachment://'+weapName);
        } else {
            files.push(new Discord.MessageAttachment(`${weapUrl}`))
            exampleEmbed.setThumbnail('attachment://'+weapName);
        }

        if (attpwr<2000){
            lollipop = message.client.emojis.cache.find(emoji => emoji.name == "AkariHug").toString();
            exampleEmbed.addField('Whale meter: ', 'loli'+lollipop);
        } else if (attpwr<3000){
            gasmlove = message.client.emojis.cache.find(emoji => emoji.name == "GasmLove").toString();
            exampleEmbed.addField('Whale meter: ', 'lolita'+gasmlove);
        } else if (attpwr<4000){
            dolphin = message.client.emojis.cache.find(emoji => emoji.name == "NanachiSmug").toString();
            exampleEmbed.addField('Whale meter: ', 'dolphin'+dolphin);
        } else if (attpwr<4500){
            whale = message.client.emojis.cache.find(emoji => emoji.name == "HyperYay").toString();
            exampleEmbed.addField('Whale meter: ', 'whale'+whale);
        } else if (attpwr<5000){
            whale = message.client.emojis.cache.find(emoji => emoji.name == "HyperYay").toString();
            exampleEmbed.addField('Whale meter: ', 'WHALE'+whale+whale+whale);
        } else if (attpwr>5000){
            whale = message.client.emojis.cache.find(emoji => emoji.name == "HyperYay").toString();
            exampleEmbed.addField('Whale meter: ', 'WHALE!!! '+whale+whale+whale+whale+whale+whale);
        }
        //console.log(exampleEmbed);
        message.channel.send({
            embeds: [exampleEmbed],
            files: files
        });
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

// function whale(bot, message, args, exampleEmbed, attpwr){
//     if (attpwr<2000){
//         lollipop = message.client.emojis.cache.find(emoji => emoji.name == "AkariHug").toString();
//         exampleEmbed.addField('Whale meter: ', 'loli'+lollipop);
//     } else if (attpwr<3000){
//         gasmlove = message.client.emojis.cache.find(emoji => emoji.name == "GasmLove").toString();
//         exampleEmbed.addField('Whale meter: ', 'lolita'+gasmlove);
//     } else if (attpwr<4000){
//         dolphin = message.client.emojis.cache.find(emoji => emoji.name == "NanachiSmug").toString();
//         exampleEmbed.addField('Whale meter: ', 'dolphin'+dolphin);
//     } else if (attpwr<4500){
//         whale = message.client.emojis.cache.find(emoji => emoji.name == "HyperYay").toString();
//         exampleEmbed.addField('Whale meter: ', 'whale'+whale);
//     } else if (attpwr<5000){
//         whale = message.client.emojis.cache.find(emoji => emoji.name == "HyperYay").toString();
//         exampleEmbed.addField('Whale meter: ', 'WHALE'+whale+whale+whale);
//     } else if (attpwr>5000){
//         whale = message.client.emojis.cache.find(emoji => emoji.name == "HyperYay").toString();
//         exampleEmbed.addField('Whale meter: ', 'WHALE!!! '+whale+whale+whale+whale+whale+whale);
//     }
// }