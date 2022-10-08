const express = require("express");
const router = express.Router();
const exportController = require("../controller/export.controller");

router.post("/", (request, response)=>{
  exportController.pdf(request, response);
});

router.delete("/:filename", (request, response)=>{
  exportController.deletePdf(request, response);
});

module.exports = router;
