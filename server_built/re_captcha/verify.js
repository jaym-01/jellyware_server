"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var logging_1 = require("../logging");
function verify(reqBody, passCB, failCB) {
    // ensure data exists
    if (reqBody != null && reqBody["g-recaptcha-response"] != null && reqBody["g-recaptcha-response"].length > 0) {
        // contains response code
        var recap_res = reqBody["g-recaptcha-response"];
        // send data as json file
        var data = {
            secret: process.env.SECRET,
            response: recap_res
        };
        (0, logging_1.add_log)("SUCCESS", "data ready to post to process reCAPTCHA");
        fetch("https://www.google.com/recaptcha/api/siteverify", {
            method: "post",
            body: JSON.stringify(data),
            headers: new Headers({
                "Content-Type": "application/json",
            })
        })
            .then(function (data) { return data.json(); })
            .then(function (data) {
            (0, logging_1.add_log)("SUCCESS", "recieved data from reCAPCTHA");
            // only when success is true -> can process the pass callback
            if (data != null && data.success != null && data.success != null) {
                (0, logging_1.add_log)("SUCCESS", "User passed reCAPTCHA");
                passCB();
            }
            else {
                (0, logging_1.add_log)("SUCCESS", "User failed reCAPTCHA");
                failCB();
            }
        })
            .catch(function (e) {
            (0, logging_1.add_log)("ERROR", e + "Failed when posting reCAPTCHA data");
            failCB();
        });
    }
    else {
        (0, logging_1.add_log)("SUCCESS", "data passed from client way empty on reCAPTCHA");
        failCB();
    }
}
exports.default = verify;
