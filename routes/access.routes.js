const express = require("express");
const router = express.Router();
const accessController = require("../controller/access.controller");

router.get("/", (request, response)=>{
  accessController.getAccess(request, response);
})

module.exports = router;
