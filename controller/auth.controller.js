const tokenService = require("../services/token.service");
const dbService = require("../services/database.service");

const refreshToken = async (uid, request)=>{
	const expiresIn = 86400;
	const endpoint = request.get("origin") || "http://"+request.get("host");
	const iss = endpoint+request.originalUrl;
	const data = {
		body: uid,
		iss: iss
	}
	const newToken = await tokenService.createCustomToken(data, expiresIn);

	const updateData = {
		token: newToken,
		expiresIn: expiresIn,
		updatedAt: Date.now()
	}
	await dbService.updateByQuery(uid, "user", updateData);
	return newToken;
}

const checkUserLog = async (request, response)=>{
	const token = await tokenService.verifyToken(request);
	if(token.isVerified)
	{
		const query = {
			token: request.cookies.authToken,
			isLogged: true
		}
		const dataRes = await dbService.getByQuery(query, "user");
		if(dataRes.length > 0)
		{

			const newToken = await refreshToken(token.data, request);
			response.cookie("authToken", newToken);
			return true;
		}
		else {
			return false;
		}
	}
	else {
		return false;
	}
}

const logout = async (request, response)=>{
	const query = {
		token: request.cookies.authToken
	}
	const data = {
		isLogged: false,
		updatedAt: Date.now()
	}

	const logoutRes = await dbService.updateByQuery(query, "user", data);
	if(logoutRes.modifiedCount)
	{
		return {
			isLogout: true
		};
	}
	else {
		return {
			isLogout: false
		};
	}
}

module.exports = {
	checkUserLog: checkUserLog,
	logout: logout
}