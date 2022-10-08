const tokenService = require("../services/token.service");
const dbService = require("../services/database.service");

const createUser = async (request, response)=>{
	const token = await tokenService.verifyToken(request);
	if(token.isVerified)
	{
		const data = token.data;

		const expiresIn = 86400;
		const endpoint = request.get("origin") || "http://"+request.get("host");
		const iss = endpoint+request.originalUrl;
		const tokenData = {
			body: {
				uid: data.uid,
				companyInfo: data.companyInfo,
				role: "admin"
			},
			iss: iss
		}
		const newToken = await tokenService.createCustomToken(tokenData, expiresIn);

		data["token"] = newToken;
		data["expiresIn"] = expiresIn;
		data["isLogged"] = true;
		data["role"] = "admin";

		try {
			const dataRes = await dbService.createRecord(data, "user");
			response.status(200);
			response.json({
				isUserCreated: true,
				token: newToken,
				message: "user created",
			})
		}
		catch(error)
		{
			console.log(error);
		}

	}
	else {
		response.status(401);
		response.json({message: "permission denied"});
	}
}

const getUser = async (request, response)=>{
	const token = await tokenService.verifyToken(request);
	if(token.isVerified)
	{
		const data = token.data;
		const query = {
			uid: data.uid
		}
		const dataRes = await dbService.getByQuery(query, "user");
		if(dataRes.length > 0)
		{
			response.status(200);
			response.json({
				isCompanyExist: true,
				message: "company found !",
				data: dataRes[0]
			})
		}
		else {
			response.status(404);
			response.json({
				isCompanyExist: false,
				message: "company not found !"
			})
		}

	}
	else {
		response.status(401);
		response.json({message: "Permission denied"})
	}
}

const updateUser = async (request, response)=>{
	const token = await tokenService.verifyToken(request);
	if(token.isVerified)
	{
		const query = token.data;
		const data = {
			token: request.body.token,
			expiresIn: 86400,
			isLogged: true,
			updatedAt: Date.now()
		}

		const dataRes = await dbService.updateByQuery(query, "user", data);
		response.status(200);
		response.json({message: "success"});
	}
	else {
		response.status(401);
		response.json({message: "Permission denied"})
	}
}

module.exports = {
	createUser: createUser,
	getUser: getUser,
	updateUser: updateUser
}
