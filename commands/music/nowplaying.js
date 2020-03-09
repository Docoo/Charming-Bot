module.exports = {
	name: 'nowplaying',
	description: 'Get the song that is playing.',
    usage: `nowplaying`,
    help: ``,
	execute(bot, message, args) {
		const serverQueue = bot.queue.get(message.guild.id);
		if (!serverQueue) return message.channel.send('There is nothing playing.');
		return message.channel.send(`Now playing: ${serverQueue.songs[0].title}`);
	},
};