const express = require("express");
const router = express.Router();
const tokenController = require("../controller/token.controller");

router.post("/:expires", (request, response)=>{
  tokenController.getToken(request, response)
})

module.exports = router;
