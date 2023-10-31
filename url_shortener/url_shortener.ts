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
  const hash = cryptol.createHash("MD5");
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
      res.json(fail);
    }
    
  } catch {
    res.json(fail);
  }
}

// get code for URL
function generateURL(urlObj: object, url: string): string {
  const b64Hash: string = encodeURL(url);

  // if doesn't exist - add it
  if (!(b64Hash in urlObj)) {
    urlObj[b64Hash] = url;
    writeFileSync(
      path.resolve(__dirname + "/url_data.json"),
      JSON.stringify(urlObj)
    );
  }

  return b64Hash;
}

function createURL(url: string, res) {
  var out: urlRes = { passed: false };
  try {
    // validate input

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