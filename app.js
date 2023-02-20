const Journalctl = require('journalctl');
const journalctl = new Journalctl();

// coonect to redisclient
const redis = require('redis');
const rc = redis.createClient();
rc.connect();

rc.on("error", function (error) {
    console.error(error);
});



journalctl.on('event', async (event) => {
    if(event.MESSAGE.includes('username%')){
        // var date  = event.MESSAGE.split('username%');
        var user  = event.MESSAGE.split('username%')[1].split('@')[0];
        var bytes = event.MESSAGE.split('username%')[1].split('@')[1].split('(')[1].split(')')[0];
        // console.log(event.MESSAGE.split('username%')[1].split('@')[0])
        
        await rc.sendCommand(['INCRBY', user, bytes ]);

        console.log(user, (await rc.get(user))/1000000 , 'mb' )

	// (await rc.keys('*')).map(async (i)=>{
	//   console.log(i , (await rc.get(i))/1000 )
	// });
    }
});
