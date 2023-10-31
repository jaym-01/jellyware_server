"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var logging_1 = require("./logging");
var express = require("express");
var app = express();
var path = require("path");
var bp = require("body-parser");
var mul = require("multer");
require("dotenv").config({ path: path.join(__dirname + "/.env") });
//get modules I made
var convert_HTML = require("./docx_html/convert_html");
var verify = require("./re_captcha/verify").default;
var url_short = require("./url_shortener/url_shortener");
var convertHTML = convert_HTML.convert;
app.use(express.static(path.join(__dirname + "/../../" + "client/build")));
//post api request
app.post("/api/convertdocxhtml", mul().single("file"), function (req, res) {
    convertHTML(req, res, function () {
        res.send("");
        (0, logging_1.add_log)("ERROR", "Fail callback was called for docx to html");
    });
    (0, logging_1.add_log)("SUCCESS", "Called convert HTML function");
});
// check recaptcha before revealing email address
app.post("/api/verify", bp.urlencoded({ extended: false }), function (req, res) {
    var out;
    verify(req.body, function () {
        out = {
            passed: true,
            email: process.env.EMAIL,
        };
        res.json(out);
        (0, logging_1.add_log)("SUCCESS", "User passed so sent email to them");
    }, function () {
        out = {
            passed: false,
        };
        res.json(out);
        (0, logging_1.add_log)("SUCCESS", "Sent fail message back to client");
    });
});
app.get("/shorturl/:urlid", function (req, res) {
    url_short.getURL(req.params.urlid, res);
});
app.post("/api/shorturl", bp.json(), function (req, res) {
    console.log(req.body);
});
app.get("/test", function (req, res) {
    res.redirect("google.com");
});
app.get("/*", function (req, res) {
    res.sendFile(path.join(__dirname + "/../" + "build/index.html"));
});
app.listen(3000, function () { return console.log("listening"); });
