// PROJECT IMPORT
const { authJwt } = require("../middleware");
const controller = require("../controllers/producer.controller");
const { validate } = require("../validate/validate");
const {
  validateCreate,
  validateUpdateStatus,
} = require("../validate/producer.validate");

module.exports = function (app) {
  app.get("/producer", [authJwt.verifyToken], controller.getList);

  app.get("/producer/:id", [authJwt.verifyToken], controller.getOne);

  app.post(
    "/producer",
    [authJwt.verifyToken],
    [validate(validateCreate())],
    controller.create
  );

  app.put(
    "/producer/:id",
    [authJwt.verifyToken],
    [validate(validateCreate())],
    controller.updateRecord
  );

  app.put(
    "/producer/updateStatus/:id",
    [authJwt.verifyToken],
    [validate(validateUpdateStatus())],
    controller.updateStatus
  );

  app.delete("/producer/:id", [authJwt.verifyToken], controller.deleteRecord);
};
