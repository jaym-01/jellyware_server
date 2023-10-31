"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.add_log = void 0;
var fs = require('fs');
function add_log(type, message) {
    var log = (new Date()).toString() + " | Blog Upload | [" + type + "] | " + message + "\n";
    fs.appendFileSync(require('path').join(__dirname + "/server.log"), log);
}
exports.add_log = add_log;
