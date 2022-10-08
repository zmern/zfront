const tokenService = require("../services/token.service");

const getToken = async (request, response)=>{
  const expiresIn = request.params.expires;
  const data = JSON.parse(request.body.data);
  const endpoint = request.get("origin") || "http://"+request.get("host");
	const iss = endpoint+"/get-token";
	const tokenData = {
		body: data,
		iss: iss
	}
	const newToken = await tokenService.createCustomToken(tokenData, expiresIn);

  response.status(200);
  response.json({token: newToken});
}

module.exports = {
  getToken: getToken
}
