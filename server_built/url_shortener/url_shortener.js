"use strict";
var _a = require("fs"), readFileSync = _a.readFileSync, writeFileSync = _a.writeFileSync;
var path = require("path");
var cryptol = require("crypto");
// generates hash for the url
// converts hash output to base64 url string
function encodeURL(url) {
    var hash = cryptol.createHash("MD5");
    return hash.update(url).digest("base64url");
}
function getURL(b64Hash, res) {
    var fail = {
        passed: false,
    };
    try {
        // validate b64Hash
        var urlData = readFileSync(path.resolve(__dirname + "/url_data.json"));
        var urlsObjs = JSON.parse(urlData);
        if (b64Hash in urlsObjs)
            res.redirect(urlsObjs[b64Hash]);
        else {
            res.json(fail);
        }
    }
    catch (_a) {
        res.json(fail);
    }
}
// get code for URL
function generateURL(urlObj, url) {
    var b64Hash = encodeURL(url);
    // if doesn't exist - add it
    if (!(b64Hash in urlObj)) {
        urlObj[b64Hash] = url;
        writeFileSync(path.resolve(__dirname + "/url_data.json"), JSON.stringify(urlObj));
    }
    return b64Hash;
}
function createURL(url, res) {
    var out = { passed: false };
    try {
        // validate input
        // get data of string added
        var urlData = readFileSync(path.resolve(__dirname + "/url_data.json"));
        var urlsObjs = JSON.parse(urlData);
        // create/find hash of URL provided
        var b64Hash = generateURL(urlsObjs, url);
        // send correct if it does
        out = {
            passed: true,
            shorturl: b64Hash,
        };
    }
    catch (_a) {
    }
    finally {
        res.json(out);
    }
}
exports.createURL = createURL;
exports.getURL = getURL;
