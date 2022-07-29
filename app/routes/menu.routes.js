// PROJECT IMPORT
const { authJwt } = require("../middleware");
const controller = require("../controllers/menu.controller");
const { validate } = require("../validate/validate");
const {
  validateCreate,
  validateUpdateStatus,
} = require("../validate/menu.validate");

module.exports = function (app) {
  app.get("/menu", [authJwt.verifyToken], controller.getList);

  app.get("/menu/:id", [authJwt.verifyToken], controller.getOne);

  app.post(
    "/menu",
    [authJwt.verifyToken],
    [validate(validateCreate())],
    controller.create
  );

  app.put(
    "/menu/:id",
    [authJwt.verifyToken],
    [validate(validateCreate())],
    controller.updateRecord
  );

  app.put(
    "/menu/updateStatus/:id",
    [authJwt.verifyToken],
    [validate(validateUpdateStatus())],
    controller.updateStatus
  );

  app.delete("/menu/:id", [authJwt.verifyToken], controller.deleteRecord);
};
