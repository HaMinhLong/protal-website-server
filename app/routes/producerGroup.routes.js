// PROJECT IMPORT
const { authJwt } = require("../middleware");
const controller = require("../controllers/producerGroup.controller");
const { validate } = require("../validate/validate");
const {
  validateCreate,
  validateUpdateStatus,
} = require("../validate/producerGroup.validate");

module.exports = function (app) {
  app.get("/producerGroup", [authJwt.verifyToken], controller.getList);

  app.get("/producerGroup/:id", [authJwt.verifyToken], controller.getOne);

  app.post(
    "/producerGroup",
    [authJwt.verifyToken],
    [validate(validateCreate())],
    controller.create
  );

  app.put(
    "/producerGroup/:id",
    [authJwt.verifyToken],
    [validate(validateCreate())],
    controller.updateRecord
  );

  app.put(
    "/producerGroup/updateStatus/:id",
    [authJwt.verifyToken],
    [validate(validateUpdateStatus())],
    controller.updateStatus
  );

  app.delete(
    "/producerGroup/:id",
    [authJwt.verifyToken],
    controller.deleteRecord
  );
};
