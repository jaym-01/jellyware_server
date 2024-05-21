import { verifyResponse } from "./re_captcha/verify";
import { add_log } from "./logging";
import MongoDBObj from "./db/mongoFuncs";

const cors = require("cors");

const express = require("express");
const app = express();
const path = require("path");
const bp = require("body-parser");
const mul = require("multer");

require("dotenv").config({ path: path.join(__dirname + "/.env") });

//get modules I made
const convert_HTML = require("./docx_html/convert_html");
const verify = require("./re_captcha/verify").default;
const url_short = require("./url_shortener/url_shortener");

const blog_router = require("./blogs/routes");

const convertHTML = convert_HTML.convert;

let mongoClient: MongoDBObj | undefined;

const init = () => {
  try {
    mongoClient = new MongoDBObj(process.env.MONGO_URL!);
  } catch {
    // throw new Error("failed in init");
  }
};
init();

app.use((req, res, next) => {
  console.log(req.method, " | ", req.originalUrl);
  next();
});

app.use(express.static(path.join(__dirname + "/client/build")));

app.use(cors());

app.use("/api/blogs", blog_router);

//post api request
app.post("/api/convertdocxhtml", mul().single("file"), function (req, res) {
  convertHTML(req, res, () => {
    res.send("");
    add_log("ERROR", "Fail callback was called for docx to html");
  });
  add_log("SUCCESS", "Called convert HTML function");
});

// check recaptcha before revealing email address
app.post("/api/verify", bp.urlencoded({ extended: false }), (req, res) => {
  var out: verifyResponse;

  verify(
    req.body,
    () => {
      out = {
        passed: true,
        email: process.env.EMAIL,
      };

      res.json(out);

      add_log("SUCCESS", "User passed so sent email to them");
    },
    () => {
      out = {
        passed: false,
      };

      res.json(out);
      add_log("SUCCESS", "Sent fail message back to client");
    }
  );
});

app.get("/shorturl/:urlid", (req, res) => {
  if(mongoClient) url_short.getURL(req.params.urlid, res, mongoClient);
  else res.send("an error occured");
});

app.post("/api/shorturl", bp.json(), (req, res) => {
  if(mongoClient) url_short.createURL(req.body.url, res, mongoClient);
  else res.send("an error occured");
});

app.get("/api/downloadcv", async (req, res) => {
  res.download(path.resolve("./documents/jay_mistry_cv.pdf"));
});

app.get("/", (req, res)=>res.status(200).send("OK"))

app.listen(8080, () => console.log("listening"));
