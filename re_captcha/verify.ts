import { add_log } from "../logging";

export interface verifyResponse {
    passed: boolean,
    email?: string,
}

function verify(reqBody, passCB, failCB){

    // ensure data exists
    if(reqBody != null && reqBody["g-recaptcha-response"] != null && reqBody["g-recaptcha-response"].length > 0){

        // contains response code
        const recap_res = reqBody["g-recaptcha-response"];

        // send data as json file
        const data = {
            secret: process.env.RECAP_SECRET,
            response: recap_res
        }

        add_log("SUCCESS", "data ready to post to process reCAPTCHA")

        fetch("https://www.google.com/recaptcha/api/siteverify", {
            method: "post",
            body: JSON.stringify(data),
            headers: new Headers({
                "Content-Type": "application/json",
            })
        })
        .then(data=>data.json())
        .then(data=>{
            add_log("SUCCESS", "recieved data from reCAPCTHA")
            // only when success is true -> can process the pass callback
            if(data != null && data.success != null && data.success != null){
                add_log("SUCCESS", "User passed reCAPTCHA");
                passCB();
            }else{
                add_log("SUCCESS", "User failed reCAPTCHA");
                failCB();
            }
        })
        .catch((e)=>{
            add_log("ERROR", e + "Failed when posting reCAPTCHA data");
            failCB()
        });
    }
    else{
        add_log("SUCCESS", "data passed from client way empty on reCAPTCHA")
        failCB();
    }
}

export default verify;