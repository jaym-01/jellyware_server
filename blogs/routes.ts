import findAllBlogs, {getBlog} from "./routeFuncs";

const express = require('express');
const router = express.Router();

router.get("/find_blogs", async (req, res)=>{
    await findAllBlogs(res);
});

router.get("/*", async (req, res)=>{
    await getBlog(req.url, res);
});

module.exports = router;