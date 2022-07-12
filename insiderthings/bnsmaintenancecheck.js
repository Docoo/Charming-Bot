module.exports={
    name: "bnsmaintenancecheck",
    description: "",
    async execute(bot,message,args){

        //  BnS_ServerInfo.LoginServer = "updater.nclauncher.ncsoft.com";
        //  BnS_ServerInfo.Name = "BnS_UE4";
        //  BnS_ServerInfo.CDN = @"http://d37ob46rk09il3.cloudfront.net/BnS_UE4/";


        //`0000000000000000` //(short)0
        //`0000000000000100` //(short)4
        //`00001010` //(byte)10
        //`00000111` //(byte)BnS_ServerInfo.Name.Length  => (byte)7
        //`01000010011011100101001101011111010101010100010100110100` //Encoding.ASCII.GetBytes(BnS_ServerInfo.Name) => 7 bytes of ascii
        // bw.BaseStream.Position = 0L; basically move to start
        //`0000000001101000`//bw.Write((short)ms.Length); 16+16+8+8+7*8 = 104 - this shit goes to front
        //`000000000110100000000000000000000000000000000100000010100000011101000010011011100101001101011111010101010100010100110100`//final bit stream (length 104+16 = 120)
        //`0068000000040A07426E535F554534` //same shit but hex

        //var bnsServerIsOnline = null

        const net = require('net')
        const client = net.connect(27500, "updater.nclauncher.ncsoft.com", function (data){
            // console.log("Listener")
            // console.log(data)
            
            client.setEncoding('hex')
            const bufferToSend = Buffer.from('0D0004000A07426E535F554534', 'hex')
            // const intarray = new Uint8Array(bufferToSend)
            client.write(bufferToSend, function(err){
                // console.log("Data sent, error?:")
                // console.log(err)
            })

        })
        
        // client.connect(27500, "updater.nclauncher.ncsoft.com", function(){
        //     console.log('Connected');
	    //     client.write('0D0004000A07426E535F554534', 'hex', function(err){
        //         console.log("callback")
        //         console.dir(err)
        //     })
        // })

        client.on('data', function(data) {
            // console.log('Received data')
            // console.log(data)
            const reply = data
            if (reply.toString().charAt(reply.toString().length-1) == "1") {
                //bnsServerIsOnline = true
                bot.bnsServerStatusUpdate("online")
                // console.log("Bns server online")
            } else {
                //bnsServerIsOnline = false
                bot.bnsServerStatusUpdate("offline")
                // console.log("Bns server offline")
            }
            client.end()
            //client.destroy(); // kill client after server's response
        });
        client.on('error', function(err){
            console.log("BnS server status check error")
            if (err != undefined) console.log(err)
            //bnsServerIsOnline = false
            bot.bnsServerStatusUpdate("error")
        })
        
        client.on('close', function(err) {
            // console.log('Connection closed');
            // if (err != undefined) console.log(err)
        });

        client.on("end", function(err){
            // console.log("Server signaled stream end")
            // if (err != undefined) console.log(err)
        })

        //while (bnsServerIsOnline == null) await bot.sleep(100)
        // console.log(`Final check result is ${bnsServerIsOnline}`)
        return 0;
    }
}