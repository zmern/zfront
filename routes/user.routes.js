const express = require("express");
const router = express.Router();
const userController = require("../controller/user.controller");

router.post("/", (request, response)=>{
	userController.createUser(request, response);
});

router.get("/:query", (request, response)=>{
	userController.getUser(request, response)
})

router.put("/:id", (request, response)=>{
	userController.updateUser(request, response);
})

module.exports = router;
