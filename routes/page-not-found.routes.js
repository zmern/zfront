const express = require("express");
const router = express.Router();

router.get("/", (request, response)=>{
  response.render("page-not-found");
})


module.exports = router;
