module.exports = {
	name: 'play',
	description: 'Play a song in your channel!',
    usage: `play <link>`,
    help: `**link** : a valid youtube link to a song`,
	async execute(bot, message, args) {
		let songToPlay;
		let firstWord = args[0];
		if (firstWord == undefined) return message.channel.send("No song given!");
		if (firstWord.includes("youtube.com") || firstWord.includes("youtu.be")){
			songToPlay = firstWord;
		} else {
			songToPlay = bot.sum(args);
		}
		const queue = bot.musicQueue;
		const serverQueue = bot.musicQueue.get(message.guild.id);

		const voiceChannel = message.member.voiceChannel;
		if (!voiceChannel) return message.channel.send('You need to be in a voice channel to play music!');
		const permissions = voiceChannel.permissionsFor(message.client.user);
		if (!permissions.has('CONNECT') || !permissions.has('SPEAK')) {
			return message.channel.send('I need the permissions to join and speak in your voice channel!');
		}

		const song = {
			title: null,
			url: null,
		};

		try{
			songInfoRaw = undefined; //removed ytdl
			songInfo = songInfoRaw.items[0];
			console.log(songInfo.fulltitle);
			song.title= songInfo.fulltitle;
			//song.url= "https://www.youtube.com/watch?v=" + songInfo.id;
			song.url= songInfo.url;
		} catch(error) {
			message.channel.send("Could not load song, check console!");
			return console.log(error);
		}

		if (!serverQueue) {
			const queueContruct = {
				textChannel: message.channel,
				voiceChannel: voiceChannel,
				connection: null,
				songs: [],
				volume: 5,
				playing: true,
			};

			queue.set(message.guild.id, queueContruct);

			queueContruct.songs.push(song);

			try {
				var connection = await voiceChannel.join();
				queueContruct.connection = connection;
				await play(message, queueContruct.songs[0], queue);
			} catch (err) {
				console.log(err);
				queue.delete(message.guild.id);
				return message.channel.send(err);
			}
		} else {
			serverQueue.songs.push(song);
			return message.channel.send(`${song.title} has been added to the queue!`);
		}
	}
};



async function play(message, song, queue) {
	const guild = message.guild;
	const serverQueue = queue.get(message.guild.id);

	if (!song) {
		serverQueue.voiceChannel.leave();
		queue.delete(guild.id);
		return;
	}
	//let what = await ytdl(song.url);
	const dispatcher = serverQueue.connection.playArbitraryInput(song.url)
		.on('end', () => {
			console.log('Music ended!');
			serverQueue.songs.shift();
			play(message, serverQueue.songs[0], queue);
		})
		.on('error', error => {
			console.error(error);
		});
	dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
}