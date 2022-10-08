const express = require("express");
const router = express.Router();
const authController = require("../controller/auth.controller");

router.get("/", async (request, response)=>{
	const logout = await authController.logout(request, response);
	if(logout.isLogout)
	{
		response.clearCookie("authToken");
		response.redirect("/");
	}
	else {
		response.redirect("/profile");
	}
})

module.exports = router;