const tokenService = require("../services/token.service");
const accessRole = {
  admin: [
    "/clients"
  ],
  client: [
    "/business"
  ],
  team: []
}

const permission = async (request, response, next)=>{
  const token = await tokenService.verifyToken(request);
  const role = token.data.role;
  const accessUrl = request.originalUrl;
  if(accessRole[role].indexOf(accessUrl) != -1)
  {
    next();
  }
  else {
    response.redirect("/page-not-found")
  }

}

module.exports = permission
