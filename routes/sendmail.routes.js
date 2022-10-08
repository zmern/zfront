const express = require("express");
const router = express.Router();
const sendmailController = require("../controller/sendmail.controller");

router.post("/", (request, response)=>{
  sendmailController.sendEmail(request, response);
});

module.exports = router;
