const tokenService = require("../services/token.service");
const dbService = require("../services/database.service");

const createCompany = async (request, response)=>{
	const token = await tokenService.verifyToken(request);
	if(token.isVerified)
	{
		const data = token.data;

		try {
			const dataRes = await dbService.createRecord(data, "company");

			response.status(200);
			response.json({
				isCompanyCreated: true,
				message: "Company Created",
				data: dataRes
			})
		}
		catch(error)
		{
			response.status(409);
			response.json({
				isCompanyCreated: false,
				message: error
			});
		}
	}
	else {
		response.status(401);
		response.json({message: "permission denied"});
	}
}

const getCompany = async (request, response)=>{
	const token = await tokenService.verifyToken(request);
	if(token.isVerified)
	{
		const data = token.data;
		const query = {
			email: data.email
		}
		const dataRes = await dbService.getByQuery(query, "company");
		if(dataRes.length > 0)
		{
			response.status(200);
			response.json({
				isCompanyExist: true,
				message: "company found",
				data: dataRes[0]
			})
		}
		else {
			response.status(404);
			response.json({
				isCompanyExist: false,
				message: "compnay not found !"
			})
		}
	}
	else {
		response.status(401);
		response.json({message: "Permission denied"});
	}
}

const updateCompanyData = async (request, response)=>{
	const token = await tokenService.verifyToken(request);
	if(token.isVerified)
	{
		const id = request.params.id;
		const formData = request.body;
		const data = {
			isLogo: formData.isLogo,
			logoUrl: formData.logoUrl
		}

		try {
			const dataRes = await dbService.updateById(id, data, "company");
			const newToken = await refreshToken(request, id, dataRes);
			response.cookie("authToken", newToken, {maxAge: 86400000});
			response.status(201);
			response.json({message: "update success", data: dataRes});
		}
		catch(error)
		{
			response.status(404);
			response.json({message: "update failed"});
		}
	}
	else {
		response.status(401);
		response.json({message: "permission denied"});
	}
}

const refreshToken = async (request, id, dataRes)=>{
	const data = {
		uid: id,
		companyInfo: dataRes
	}
	const query = {
		uid: id
	}
	const expiresIn = 86400;
	const endpoint = request.get("origin") || "http://"+request.get("host");
	const iss = endpoint+"/api/private/company";
	const option = {
		body: data,
		iss: iss
	}
	const newToken = await tokenService.createCustomToken(option, expiresIn);

	const updateData = {
		token: newToken,
		expiresIn: expiresIn,
		updatedAt: Date.now()
	}
	await dbService.updateByQuery(query, "user", updateData);
	return newToken;
}

module.exports = {
	createCompany: createCompany,
	getCompany: getCompany,
	updateCompanyData: updateCompanyData
}
