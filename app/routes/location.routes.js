// PROJECT IMPORT
const { authJwt } = require("../middleware");
const controller = require("../controllers/location.controller");
const { validate } = require("../validate/validate");
const {
  validateCreate,
  validateUpdateStatus,
} = require("../validate/location.validate");

module.exports = function (app) {
  app.get("/location", [authJwt.verifyToken], controller.getList);

  app.get("/location/:id", [authJwt.verifyToken], controller.getOne);

  app.post(
    "/location",
    [authJwt.verifyToken],
    [validate(validateCreate())],
    controller.create
  );

  app.put(
    "/location/:id",
    [authJwt.verifyToken],
    [validate(validateCreate())],
    controller.updateRecord
  );

  app.put(
    "/location/updateStatus/:id",
    [authJwt.verifyToken],
    [validate(validateUpdateStatus())],
    controller.updateStatus
  );

  app.delete("/location/:id", [authJwt.verifyToken], controller.deleteRecord);
};
