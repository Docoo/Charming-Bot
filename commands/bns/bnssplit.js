module.exports = {
    name: "bnssplit",
    description: "Calculates the split between 6-12 people",
    usage: `bnssplit <sum>`,
    help: `<sum> : the amount you want to split
            \tCan be multiple values separated by + and -`,
    async execute(bot,message,args){
        const Discord = require('discord.js');
        let sumString = args.toString();
        sumString = sumString.replace(/,/g, "");
        sumString = sumString.replace(/ /g, "");
        let terms = sumString.split(/[+-]/g);
        console.dir(terms);
        let signs = sumString.split("");
        console.dir(signs);
        let sum = parseInt(terms[0]);
        let index = 1;
        for (let sign of signs){
            console.log(sign);
            if (sign == "+"){
                sum += parseInt(terms[index]);
                index++;
            } else if (sign == "-"){
                sum -= parseInt(terms[index]);
                index++;
            }
        }
        fivePercentCut = sum * 5 / 100;
        sumToSplit = sum - fivePercentCut;
        let newEmbed = new Discord.MessageEmbed();
        newEmbed.setTitle("Split calculator");
        // newEmbed.addField(`Total sum is ${sum} gold`,"")
        //     .addField(`6-man split is ${(sum/6).toFixed(2)}\n`,"")
        //     .addField(`7-man split is ${(sum/7).toFixed(2)}\n`,"")
        //     .addField(`8-man split is ${(sum/8).toFixed(2)}\n`,"")
        //     .addField(`9-man split is ${(sum/9).toFixed(2)}\n`,"")
        //     .addField(`10-man split is ${(sum/10).toFixed(2)}\n`,"")
        //     .addField(`11-man split is ${(sum/11).toFixed(2)}\n`,"");
        newEmbed.setDescription(`Total sum is ${sum} gold
            6-man split is ${(sum/6).toFixed(2)}
            7-man split is ${(sum/7).toFixed(2)}
            8-man split is ${(sum/8).toFixed(2)}
            9-man split is ${(sum/9).toFixed(2)}
            10-man split is ${(sum/10).toFixed(2)}
            11-man split is ${(sum/11).toFixed(2)}`);
        message.channel.send({
            embeds: [newEmbed]
        });
        return 0;
    }
}