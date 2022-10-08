const tokenService = require("../services/token.service");

const accessList = {
  admin: {
    toolbar: [
      {
        label: "Notifications",
        icon: "fa fa-bell",
        link: "notifications",
        design: "icon-btn-dark"
      },
      {
        label: "Clients",
        icon: "fas fa-user-secret",
        link: "clients",
        design: "icon-btn-primary"
      },
      {
        label: "Teams",
        icon: "fas fa-users",
        link: "teams",
        design: "icon-btn-warning"
      },
      {
        label: "Setting",
        icon: "fa fa-gear",
        link: "setting",
        design: "icon-btn-info"
      },
      {
        label: "Logout",
        icon: "fa fa-sign-out-alt",
        link: "logout",
        design: "icon-btn-danger"
      }
    ]
  },
  client: {
    toolbar: [
      {
        label: "Logout",
        icon: "fa fa-sign-out-alt",
        link: "logout",
        design: "icon-btn-danger"
      }
    ]
  },
  team: {}
}

const getAccess = async (request, response)=>{
  const token = await tokenService.verifyToken(request);
  if(token.isVerified)
  {
    const role = token.data.role;

    response.status(200);
    response.json({
      data: accessList[role]
    })
  }
  else {
    response.status(401);
    response.json({message: "Permission denied"})
  }

}

module.exports = {
  getAccess: getAccess
}
