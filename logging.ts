const fs = require('fs');

function add_log(type:string, message:string) : void{
    // let log: string = (new Date()).toString() + " | Blog Upload | [" + type + "] | " + message + "\n";
    // fs.appendFileSync(require('path').join(__dirname + "/server.log"), log)
}

export {add_log};