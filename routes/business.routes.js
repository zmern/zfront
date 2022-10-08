const express = require("express");
const router = express.Router();
const routePermission = require("../middleware/route-permission.middleware");

router.get("/", routePermission, (request, response)=>{
  response.render("business");
});

module.exports = router;
