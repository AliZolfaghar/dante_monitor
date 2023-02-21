const {exec} = require('child_process');

// update repo from github 
const fetchUpdateFromGit = ()=>{    
    const command = 'git pull';
    exec(command, (error, stdout, stderr) => {
        if(stderr) console.error(`stderr: ${stderr}`);
        if(error)  console.error(`exec error: ${error}`);
        console.log('upate app : '); 
        console.log(stdout); 
    });// exec
}; // fetchUpdateFromGit


// check to see if update needed  ?
const checkUpdate = async () => {
    return new Promise((resolve , reject)=>{
        const command = 'git fetch && git show-ref';
        exec(command, (error, stdout, stderr) => {
            // comment to prevent show error in pm2 log
            // if(stderr) console.error(`stderr: ${stderr}`);
            if(error)  console.error(`exec error: ${error}`);
            if(error)  return reject(error);

            // fetch and get hash data 
            const data = stdout.split('\n').filter(item => item.length > 0).map(item => item.split(' ')[0]);

            // console.log(data); 
            if (data[0] != data[1]) {
                resolve(true); // return true , so update is available 
            } else {
                resolve(false); // return false , so there is no available update 
            }
        });// exec        
    });// promis
};//checkUpdate


// entry point 
const update = async()=>{
    var needUpdate = await checkUpdate();
    if(needUpdate){
        console.log('app need update ?' , needUpdate ? 'YES' : 'NO');
        fetchUpdateFromGit();
    }else{
        console.log('app need update ?' , needUpdate ? 'YES' : 'NO');
    }
}; // update 

module.exports = {  update , checkUpdate }
