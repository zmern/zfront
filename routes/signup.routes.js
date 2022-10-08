const express = require("express");
const router = express.Router();
const tokenService = require("../services/token.service");
const httpService = require("../services/http.service");

router.post("/", async (request, response)=>{
	const expiresIn = 120;
	const token = await tokenService.createToken(request, expiresIn);


	const endpoint = request.get("origin") || "http://"+request.get("host");
	const companyRes = await httpService.postRequest({
		endpoint: endpoint,
		api: "/api/private/company",
		data: token

	});

	if(companyRes.body.isCompanyCreated)
	{
		const endpoint = request.get("origin") || "http://"+request.get("host");
		const formData = {
			uid: companyRes.body.data._id,
			password: request.body.password,
			companyInfo: companyRes.body.data
		};
		const data = {
			iss: endpoint+request.originalUrl,
			body: formData
		}
		const userToken = await tokenService.createCustomToken(data, expiresIn);

		const userRes = await httpService.postRequest({
			endpoint: endpoint,
			api: "/api/private/user",
			data: userToken
		});
		const millisecondsInOnDay = 86400000; // 1 day
		response.cookie("authToken", userRes.body.token, {maxAge: millisecondsInOnDay});
		response.status(userRes.status);
		response.json(userRes.body);
	}
	else {
		response.status(companyRes.status);
		response.json(companyRes.body);
	}
})

module.exports = router;
