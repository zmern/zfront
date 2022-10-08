const express = require("express");
const router = express.Router();
const tokenService = require("../services/token.service");
const httpService = require("../services/http.service");
const bcryptService = require("../services/bcrypt.service");

router.post("/", async (request, response)=>{
	const loginAs = request.body.loginAs;

	if(loginAs == "admin")
	{
		adminLogger(request, response);
	}

	if(loginAs == "client")
	{
		clientLogger(request, response);
	}

	if(loginAs == "team")
	{
		teamLogger(request, response);
	}
})

const adminLogger = async (request, response)=>{
	const expiresIn = 120;
	const token = await tokenService.createToken(request, expiresIn);

	const companyRes = await httpService.getRequest({
		endpoint: request.get("origin") || "http://"+request.get("host") || "https://"+request.get("host"),
		api: "/api/private/company",
		data: token
	});
	if(companyRes.body.isCompanyExist)
	{
		const uid = companyRes.body.data._id;
		const password = request.body.password;
		const formData = {
			uid: uid,
			companyInfo: companyRes.body.data
		}

		const endpoint = request.get("origin") || "http://"+request.get("host") || "https://"+request.get("host");
		const iss = endpoint+request.originalUrl;
		const data = {
			body: formData,
			iss: iss
		}

		const userToken = await tokenService.createCustomToken(data, expiresIn);

		const userRes = await httpService.getRequest({
			endpoint: endpoint,
			api: "/api/private/user",
			data: userToken
		});

		// update role in authToken
		const role = userRes.body.data.role;
		formData['role'] = role;

		if(userRes.body.isCompanyExist)
		{

			// allow single device login

			/*
			if(userRes.body.data.isLogged)
			{
				response.status(406);
				response.clearCookie("authToken");
				response.json({message: "Please logout from other device"});
				return false;
			}
			*/

			const realPass = userRes.body.data.password;
			const typedPass = request.body.password;
			const isLogged = await bcryptService.dcrypt(typedPass, realPass);
			if(isLogged)
			{

				const secondsInOneDay = 86400;
				const authToken = await tokenService.createCustomToken(data, secondsInOneDay);

				const userPutRes = await httpService.putRequest({
					endpoint: endpoint,
					api: "/api/private/user",
					data: authToken
				});

				const milliSecondsInOneDay = 86400000;
				response.cookie("authToken", authToken, {maxAge: milliSecondsInOneDay});

				response.status(200);
				response.json({
					role: "admin",
					isLogged: true,
					message: "success"
				})
			}
			else {
				response.status(401);
				response.json({
					isLogged: false,
					message: "Wrong password !"
				})
			}
		}
		else {
			response.status(userRes.status);
			response.json(userRes.body);
		}

	}
	else {
		response.status(companyRes.status);
		response.json(companyRes.body);
	}
}

const clientLogger = async (request, response)=>{
	const expiresIn = 120;
	const token = await tokenService.createToken(request, expiresIn);

	const companyRes = await httpService.getRequest({
		endpoint: request.get("origin") || "http://"+request.get("host") || "https://"+request.get("host"),
		api: "/clients/login",
		data: token
	});
	if(companyRes.body.isCompanyExist)
	{
		const uid = companyRes.body.data._id;
		const password = request.body.password;
		const formData = {
			uid: uid,
			clientInfo: companyRes.body.data
		}

		const endpoint = request.get("origin") || "http://"+request.get("host") || "https://"+request.get("host");
		const iss = endpoint+request.originalUrl;
		const data = {
			body: formData,
			iss: iss
		}

		const userToken = await tokenService.createCustomToken(data, expiresIn);

		const userRes = await httpService.getRequest({
			endpoint: endpoint,
			api: "/api/private/user",
			data: userToken
		});

		// update role in authToken
		const role = userRes.body.data.role;
		formData['role'] = role;


		if(userRes.body.isCompanyExist)
		{

			// allow single device login

			/*
			if(userRes.body.data.isLogged)
			{
				response.status(406);
				response.clearCookie("authToken");
				response.json({message: "Please logout from other device"});
				return false;
			}
			*/

			const realPass = userRes.body.data.password;
			const typedPass = request.body.password;
			const isLogged = await bcryptService.dcrypt(typedPass, realPass);
			if(isLogged)
			{

				const secondsInOneDay = 86400;
				const authToken = await tokenService.createCustomToken(data, secondsInOneDay);

				const userPutRes = await httpService.putRequest({
					endpoint: endpoint,
					api: "/api/private/user",
					data: authToken
				});

				const milliSecondsInOneDay = 86400000;
				response.cookie("authToken", authToken, {maxAge: milliSecondsInOneDay});

				response.status(200);
				response.json({
					role: "client",
					isLogged: true,
					message: "success"
				})
			}
			else {
				response.status(401);
				response.json({
					isLogged: false,
					message: "Wrong password !"
				})
			}
		}
		else {
			response.status(userRes.status);
			response.json(userRes.body);
		}

	}
	else {
		response.status(companyRes.status);
		response.json(companyRes.body);
	}
}

const teamLogger = async (request, response)=>{
	const expiresIn = 120;
	const token = await tokenService.createToken(request, expiresIn);

	const companyRes = await httpService.getRequest({
		endpoint: request.get("origin") || "http://"+request.get("host") || "https://"+request.get("host"),
		api: "/api/private/company",
		data: token
	});
	if(companyRes.body.isCompanyExist)
	{
		const uid = companyRes.body.data._id;
		const password = request.body.password;
		const formData = {
			uid: uid,
			teamInfo: companyRes.body.data
		}

		const endpoint = request.get("origin") || "http://"+request.get("host") || "https://"+request.get("host");
		const iss = endpoint+request.originalUrl;
		const data = {
			body: formData,
			iss: iss
		}

		const userToken = await tokenService.createCustomToken(data, expiresIn);

		const userRes = await httpService.getRequest({
			endpoint: endpoint,
			api: "/api/private/user",
			data: userToken
		});

		// update role in authToken
		const role = userRes.body.data.role;
		formData['role'] = role;

		if(userRes.body.isCompanyExist)
		{

			// allow single device login

			/*
			if(userRes.body.data.isLogged)
			{
				response.status(406);
				response.clearCookie("authToken");
				response.json({message: "Please logout from other device"});
				return false;
			}
			*/

			const realPass = userRes.body.data.password;
			const typedPass = request.body.password;
			const isLogged = await bcryptService.dcrypt(typedPass, realPass);
			if(isLogged)
			{

				const secondsInOneDay = 86400;
				const authToken = await tokenService.createCustomToken(data, secondsInOneDay);

				const userPutRes = await httpService.putRequest({
					endpoint: endpoint,
					api: "/api/private/user",
					data: authToken
				});

				const milliSecondsInOneDay = 86400000;
				response.cookie("authToken", authToken, {maxAge: milliSecondsInOneDay});

				response.status(200);
				response.json({
					role: "team",
					isLogged: true,
					message: "success"
				})
			}
			else {
				response.status(401);
				response.json({
					isLogged: false,
					message: "Wrong password !"
				})
			}
		}
		else {
			response.status(userRes.status);
			response.json(userRes.body);
		}

	}
	else {
		response.status(companyRes.status);
		response.json(companyRes.body);
	}
}

module.exports = router;
