import DB from "../db/types";

const { readFileSync, writeFileSync } = require("fs");
const path = require("path");
const cryptol = require("crypto");

interface urlRes {
  passed: boolean;
  shorturl?: string;
}

// generates hash for the url
// converts hash output to base64 url string
function encodeURL(url: string): string {
  // produces 128 bit hash -> converted into a base64  
  const hash = cryptol.createHash("MD5");

  // return 22 chaar string
  // the binary number from hash = base64url
  return hash.update(url).digest("base64url");
}

function getURL(b64Hash: string, res) {
  var fail: urlRes = {
    passed: false,
  };
  try {
    // validate b64Hash

    var urlData = readFileSync(path.resolve(__dirname + "/url_data.json"));
    var urlsObjs = JSON.parse(urlData);

    if (b64Hash in urlsObjs) res.redirect(urlsObjs[b64Hash]);
    else {
      res.sendStatus(404);
    }
    
  } catch {
    res.sendStatus(404);
  }
}

function createURL(url: string, res, db: DB) {
  var out: urlRes = { passed: false };
  try {
    // validate url
    
    // create hash of url
    const b64Hash = encodeURL(url);

    // check if in db
    // db.findOneRecord();

    // send correct if it does
    out = {
      passed: true,
      shorturl: b64Hash,
    };
  } catch {
  } finally {
    res.json(out);
  }
}

exports.createURL = createURL;
exports.getURL = getURL;