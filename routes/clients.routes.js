const express = require("express");
const router = express.Router();
const clientsController = require("../controller/clients.controller");
const routePermission = require("../middleware/route-permission.middleware");

router.get("/", routePermission, (request, response)=>{
  response.render("clients");
});

router.get("/count-all", (request, response)=>{
  clientsController.countClients(request, response);
})

router.get("/login/:query", (request, response)=>{
  clientsController.getClientsId(request, response);
})

router.get("/invitation/:clientToken", (request, response)=>{
  clientsController.invitation(request, response);
})

router.get("/all/:companyId", (request, response)=>{
  clientsController.allClients(request, response);
})

router.get("/:from/:to", (request, response)=>{
  clientsController.paginate(request, response);
})

router.post("/", (request, response)=>{
  clientsController.create(request, response);
});

router.post("/:id", (request, response)=>{
  clientsController.createUser(request, response);
});

router.delete("/:id", (request, response)=>{
  clientsController.deleteClients(request, response);
});

router.put("/:id", (request, response)=>{
  clientsController.updateClients(request, response);
})

module.exports = router;
