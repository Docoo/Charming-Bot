module.exports = {
	name: 'stop',
	description: 'Stop all songs in the queue!',
    usage: `stop`,
    help: ``,
	execute(bot, message, args) {
		const serverQueue = bot.musicQueue.get(message.guild.id);
		if (!message.member.voiceChannel) return message.channel.send('You have to be in a voice channel to stop the music!');
		serverQueue.songs = [];
		serverQueue.connection.dispatcher.end();
	},
};