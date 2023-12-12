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

// get code for URL
function generateURL(urlObjs: object, url: string): string {
  const b64Hash: string = encodeURL(url);

  // if doesn't exist - add it
  if (!(b64Hash in urlObjs)) {
    urlObjs[b64Hash] = url;
    writeFileSync(
      path.resolve(__dirname + "/url_data.json"),
      JSON.stringify(urlObjs)
    );
  }

  return b64Hash;
}

function createURL(url: string, res) {
  var out: urlRes = { passed: false };
  try {
    // get data of string added
    var urlData = readFileSync(path.resolve(__dirname + "/url_data.json"));
    var urlsObjs = JSON.parse(urlData);

    // create/find hash of URL provided
    const b64Hash = generateURL(urlsObjs, url);

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