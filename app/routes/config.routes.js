const controller = require("../controllers/config.controller");
const { authJwt } = require("../middleware");

module.exports = function (app) {
  app.get("/config", [authJwt.verifyToken], controller.getList);

  app.post("/config", [authJwt.verifyToken], controller.create);

  app.put("/config/:id", [authJwt.verifyToken], controller.updateRecord);

  app.delete("/config/:id", [authJwt.verifyToken], controller.deleteRecord);
};
