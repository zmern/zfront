const tokenService = require("../services/token.service");
const dbService = require("../services/database.service");

const create = async (request, response)=>{
  const token = await tokenService.verifyToken(request);
  if(token.isVerified)
  {
    const data = request.body;
    data["companyId"] = token.data.uid;
    try {
      const dataRes = await dbService.createRecord(data, "client");
      response.status(200);
      response.json({
        message: "Success",
        data: dataRes
      })
    }
    catch(error)
    {
      response.status(409);
      response.json({
        message: "client email already exist"
      })
    }
  }
  else {
    response.status(401);
    response.json({message: "Permission denied"})
  }
}

const countClients = async (request, response)=>{
  const token = await tokenService.verifyToken(request);
  if(token.isVerified)
  {
    const dataRes = await dbService.countData("client");
    response.status(200);
    response.json({data: dataRes});
  }
  else {
    response.status(401);
    response.json({
      message: "Permission denied"
    })
  }
}

const paginate = async (request, response)=>{
  const token = await tokenService.verifyToken(request);
  if(token.isVerified)
  {
    const query = {
      companyId: token.data.uid
    };
    const from = Number(request.params.from);
    const to = Number(request.params.to);
    const dataRes = await dbService.paginate(query, from, to, "client");
    response.status(200);
    response.json({data: dataRes})
  }
  else {
    response.status(401);
    response.json({message: "permission denied"})
  }
}

const deleteClients = async (request, response)=>{
  const token = await tokenService.verifyToken(request);
  if(token.isVerified)
  {
    const id = request.params.id;
    const dataRes = await dbService.deleteById(id, "client");
    response.status(200);
    response.json({data: dataRes});
  }
  else {
    response.status(401);
    response.json({message: "Permission denied"})
  }
}

const updateClients = async (request, response)=>{
  const token = await tokenService.verifyToken(request);
  if(token.isVerified)
  {
    const id = request.params.id;
    const data = request.body;

    const updateRes = await dbService.updateById(id, data, "client");
    response.status(201);
    response.json({
      data: updateRes
    })
  }
  else {
    response.status(401);
    response.json({message: "Permission denied"})
  }
}

const allClients = async (request, response)=>{
  const token = await tokenService.verifyToken(request);
  if(token.isVerified)
  {
    const query = {
      companyId: request.params.companyId
    };

    const dataRes = await dbService.getByQuery(query, "client");
    response.status(200);
    response.json({data: dataRes})
  }
  else {
    response.status(401);
  }
}

const invitation = async (request, response)=>{
  const token = request.params.clientToken;
  const tokenData = await tokenService.customTokenVerification(token);
  if(tokenData.isVerified)
  {
    const clientId = tokenData.data.clientId;
    const client = await getClientInfo(clientId);

    if(!client.isUser)
    {
      response.render("invitation");
    }
    else {
      response.redirect("/");
    }
  }
  else {
    response.status(401);
    response.redirect("/");
  }
}

const getClientInfo = async (id)=>{
  const query = {
    _id: id
  }

  const dataRes = await dbService.getByQuery(query, "client");
  return dataRes[0];
}

const createUser = async (request, response)=>{
  const query = {
    _id: request.params.id
  }
  const updateMe = {
    isUser: true,
    updatedAt: Date.now()
  }

  await dbService.updateById(query, updateMe, "client");

  const userData = {
    uid: request.params.id,
    password: request.body.password,
    role: "client"
  }

  await dbService.createRecord(userData, "user");

  response.status(200);
  response.json({message: "Success"})
}

const getClientsId = async (request, response)=>{
	const token = await tokenService.verifyToken(request);
	if(token.isVerified)
	{
		const data = token.data;
		const query = {
			clientEmail: data.email
		}
		const dataRes = await dbService.getByQuery(query, "client");
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

module.exports = {
  create: create,
  countClients: countClients,
  paginate: paginate,
  deleteClients: deleteClients,
  updateClients: updateClients,
  allClients: allClients,
  invitation: invitation,
  createUser: createUser,
  getClientsId: getClientsId
}
