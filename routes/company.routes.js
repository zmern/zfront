const express = require("express");
const router = express.Router();
const companyController = require("../controller/company.controller");

router.post("/", (request, response)=>{
	companyController.createCompany(request, response);
})

router.get("/:query", (request, response)=>{
	companyController.getCompany(request, response)
})

router.put("/:id", (request, response)=>{
	companyController.updateCompanyData(request, response);
})

module.exports = router;
