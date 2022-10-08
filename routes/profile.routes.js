const express = require("express");
const router = express.Router();

router.get("/", (request, response)=>{
	response.render("profile");
})

module.exports = router;