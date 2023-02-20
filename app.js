const express = require('express');
const app = express();

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
        var user  = event.MESSAGE.split('username%')[1].split('@')[0];
        var bytes = event.MESSAGE.split('username%')[1].split('@')[1].split('(')[1].split(')')[0];
        await rc.sendCommand(['INCRBY', user, bytes ]);
    }
});


app.get('/',async (req,res)=>{
    var data = [] ;
    var users = await rc.keys('*')
    for(i in users){
        var user = users[i];
        var traffic = await rc.get(user)
        data.push({user,traffic : traffic/1000000})
        console.log(user , traffic);
    }

    res.json(data);
});

app.listen(80)
