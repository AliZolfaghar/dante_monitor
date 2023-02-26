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

// www 
app.use(express.static('./www'));

// git hook update on current branch
const {update} = require('./gitHookUpdate');
app.all('/githookupdate', async (req, res) => {
    update();
    res.json({ message : 'git-hook-update'});
});

var dns = require('dns');

function reverseLookup(ip) {
    dns.reverse(ip,function(err,domains){
    // if(err!=null)	callback(err);
    if(!domains) return false ;
        domains.forEach(function(domain){
	dns.lookup(domain,function(err, address, family){
	    console.log(domain,'[',address,']');
	    console.log('reverse:',ip==address);
	    });
        });
    });
}


journalctl.on('event', async (event) => {
    if(event.MESSAGE.includes('username%')){
        var user  = event.MESSAGE.split('username%')[1].split('@')[0];
        var bytes = event.MESSAGE.split('username%')[1].split('@')[1].split('(')[1].split(')')[0];
        var ip =  event.MESSAGE.split('username%')[0].split('tcp/connect -: ')[1].split(' ')[0].split('.');
        var site = ip.length==5 ? `${ip[0]}.${ip[1]}.${ip[2]}.${ip[3]}` : `127.0.0.1`;
        await rc.sendCommand(['INCRBY', user, bytes ]);
        // console.log(user , bytes , event.MESSAGE.split('username%')[1].split('@')[1].split(' ')[0]);
        console.log(user , bytes , site);
        // console.log(user , bytes , reverseLookup(site));
    }
});


app.get('/usage',async (req,res)=>{
    var data = [] ;
    var users = await rc.keys('*')
    for(i in users){
        var user = users[i];
        var traffic = await rc.get(user)
        data.push({user,traffic : traffic/1000000})
        console.log(user , traffic);
    }

    res.header("Access-Control-Allow-Origin", "*");
    res.json(data);
});

app.listen(80)
