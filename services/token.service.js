require("dotenv").config();
const jwt = require("jsonwebtoken");
const secret_key = process.env.SECRET_KEY;
const issService = require("./iss.service");

const create = async (request, expiresIn)=>{
	const formData = request.body;
	const endpoint = request.get("origin") || "http://"+request.get("host");
	const iss = endpoint+request.originalUrl;
	const token = await jwt.sign({
		iss: iss,
		data: formData
	}, secret_key, {expiresIn: expiresIn});

	return token;
}

const createCustom = async (data, expiresIn)=>{
	const formData = data.body;
	const token = await jwt.sign({
		iss: data.iss,
		data: formData
	}, secret_key, {expiresIn: expiresIn});

	return token;
}

const verify = async (request)=>{
	let token = "";
	if(request.method == "GET")
	{
		if(request.headers["x-auth-token"])
		{
			token = request.headers["x-auth-token"];
		}
		else {
			if(request.originalUrl.indexOf("/clients/invitaion") != -1){
				tmp = request.origanlUrl.split("/");
				token = tmp[3];
			}
			else {
				token = request.cookies.authToken;
			}

		}
	}
	else {
		token = request.body.token;
	}

	if(token)
	{
		try {
			const tmp = await jwt.verify(token, secret_key);
			if(issService.indexOf(tmp.iss) != -1)
			{
				return {
					isVerified: true,
					data: tmp.data
				}
			}
			else {
				return {
					isVerified: false
				}
			}
		}
		catch(error)
		{
			return {
				isVerified: false
			}
		}
	}
	else {
		return {
			isVerified: false
		}
	}

}

const customTokenVerification = async (token)=>{

		try {
			const tmp = await jwt.verify(token, secret_key);
			if(issService.indexOf(tmp.iss) != -1)
			{
				return {
					isVerified: true,
					data: tmp.data
				}
			}
			else {
				return {
					isVerified: false
				}
			}
		}
		catch(error)
		{
			return {
				isVerified: false
			}
		}

}

module.exports = {
	createToken: create,
	verifyToken: verify,
	createCustomToken: createCustom,
	customTokenVerification: customTokenVerification
}
