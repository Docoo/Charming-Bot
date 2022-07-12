const { isInteger, isUndefined, toInteger } = require("lodash");

module.exports = {
    name: 'countdown',
    description: 'create timer, 1 min updates',
    usage: `countdown <hours> <minutes>`,
    help: `**hours, minutes** : numbers that are valid`,
    async execute(bot, message, args){
        let hours = toInteger(args[0]);
        if (isUndefined(hours)) {
            hours = 0;
        }
        let minutes = toInteger(args[1]);
        if (isUndefined(minutes)){
            minutes = 0;
        }
		if (!isInteger(hours) || !isInteger(minutes) || hours > 23 || minutes > 59){
            return message.reply("Invalid input data");
        }
        const Discord = require('discord.js');
        const embed = new Discord.MessageEmbed();
        embed.setTitle("**Countdown**")
            .setDescription(`**${hours} hours : ${minutes} minutes left**`);
        let countdownMessage = await message.channel.send({embeds: [embed]});

        let countdown = JSON.parse("{}");
        countdown.server_name = message.guild.name;
        countdown.server_id = message.guild.id;
        countdown.channel_id = message.channel.id;
        countdown.message_id = countdownMessage.id;

        let date = new Date();
        date.setMinutes(date.getMinutes()+minutes);
        date.setHours(date.getHours()+hours);

        countdown.targetDate = date;

        bot.countdowns.push(countdown);
        bot.updateCountdowns();
    }
}