// PROJECT IMPORT
const { authJwt } = require("../middleware");
const controller = require("../controllers/paymentMethod.controller");
const { validate } = require("../validate/validate");
const {
  validateCreate,
  validateUpdateStatus,
} = require("../validate/paymentMethod.validate");

module.exports = function (app) {
  app.get("/paymentMethod", [authJwt.verifyToken], controller.getList);

  app.get("/paymentMethod/:id", [authJwt.verifyToken], controller.getOne);

  app.post(
    "/paymentMethod",
    [authJwt.verifyToken],
    [validate(validateCreate())],
    controller.create
  );

  app.put(
    "/paymentMethod/:id",
    [authJwt.verifyToken],
    [validate(validateCreate())],
    controller.updateRecord
  );

  app.put(
    "/paymentMethod/updateStatus/:id",
    [authJwt.verifyToken],
    [validate(validateUpdateStatus())],
    controller.updateStatus
  );

  app.delete(
    "/paymentMethod/:id",
    [authJwt.verifyToken],
    controller.deleteRecord
  );
};
