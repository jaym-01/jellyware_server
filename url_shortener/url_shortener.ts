import DB from "../db/types";
import { matchString } from "../db/validate";
import { UrlSchema } from '../db/mongoFuncs';

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

async function getURL(b64Hash: string, res, db: DB) {
  try {
    // validate b64Hash
    const regex = /[A-Za-z0-9-_%]{22}/g;

    if(!matchString(b64Hash, regex)) throw new Error("invalid hash");

    // check if in db
    const params: UrlSchema = {
      b64Hash: b64Hash,
    }
    const dbResult = await db.findOneRecord(params);
    console.log("here")

    console.log(dbResult.url);

    if (dbResult) res.redirect(dbResult.url);
    else {
      throw new Error("hash not found in db")
    }
    
  } catch {
    res.sendStatus(404);
  }
}

async function createURL(url: string, res, db: DB) {
  var out: urlRes = { passed: false };
  try {
    // validate url
    const regex = /(http|https):\/\/[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)*(:[0-9]+)?(\/[$\-_\.\+\!\*\'\(\)\&\?=:%A-Za-z0-9]*)*/g;
    if(!matchString(url, regex)) throw new Error("invalid url");
    
    // create hash of url
    const b64Hash = encodeURL(url);

    const dbObj: UrlSchema = {
      b64Hash: b64Hash,
      url: url,
    }

    // check if in db
    const result = await db.findOneRecord(dbObj);

    console.log(result);

    // add it if not in db
    if(result == null) await db.writeRecord(dbObj);

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