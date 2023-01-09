module.exports = {
    name: 'say',
    description: 'Make cute Charmie Bot say something nice!',
    usage: `say <message>`,
    help: `**message** : any text`,
    execute(bot, message, args){
        if (args == undefined || args == null) return 0;
        let msgToSend = sum(args);
        if (message.author.id == "412077741274431498") msgToSend = "Ruki told me to say that " + msgToSend;
        message.channel.send(msgToSend).then(sentMessage => {
            console.log(`Sent message with id ${sentMessage.id} for ${message.author.username} (${message.member.displayName})`);
            message.delete().then(msg => console.log(`Deleted message from ${msg.author.username}`)).catch(console.log);
        });
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