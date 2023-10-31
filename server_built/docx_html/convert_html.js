"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convert = void 0;
var mammoth = require("mammoth");
var logging = require("../logging");
function convertToHTML(req, res, failCB) {
    var options = {
        convertImage: mammoth.images.imgElement(function (image) {
            return image.readAsBuffer().then(function (img_buffer) {
                return {
                    src: "data:" + image.contentType + ";base64," + img_buffer.toString("base64"),
                    alt: "An Image from the Word file"
                };
            });
        }),
    };
    mammoth
        .convertToHtml({ buffer: req.file.buffer }, options)
        .then(function (result) {
        var html = result.value;
        var messages = result.messages;
        if (messages.length > 0) {
            messages.forEach(function (message) {
                logging.add_log("ERROR", "Generating HTML file: " + message);
            });
        }
        //create html file
        var all_html = "\n    <html>\n        <head>\n          <link rel=\"preconnect\" href=\"https://fonts.googleapis.com\">\n          <link rel=\"preconnect\" href=\"https://fonts.gstatic.com\" crossorigin>\n          <link href=\"https://fonts.googleapis.com/css2?family=Roboto:wght@300&display=swap\" rel=\"stylesheet\">\n        </head>\n        <body style=\"font-family: Roboto, sans-serif;\">\n            " +
            html +
            " \n        </body>\n    </html>";
        res.send(all_html);
        logging.add_log("SUCCESS", "Sent html as text to client");
    })
        .catch(function (e) { return failCB; });
}
function convert(req, res, failCB) {
    try {
        //check files has been uploaded and name exists
        if (req.file == null ||
            req.file.originalname.length < 6 ||
            req.file.originalname.substring(req.file.originalname.length - 5, req.file.originalname.length) != ".docx") {
            logging.add_log("ERROR", "File uploaded is not a .docx file or is empty");
            //respond with error
            failCB();
        }
        else {
            //perform html conversion and send a response
            convertToHTML(req, res, failCB);
            logging.add_log("SUCCESS", "called function to create html file");
        }
    }
    catch (err) {
        //if any errors happen during the process - gives error
        logging.add_log("ERROR", err + ", in convert function");
        failCB();
    }
}
exports.convert = convert;
