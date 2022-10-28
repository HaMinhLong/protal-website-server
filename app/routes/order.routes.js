// PROJECT IMPORT
const { authJwt } = require("../middleware");
const controller = require("../controllers/order.controller");
const { validate } = require("../validate/validate");
const {
  validateCreate,
  validateUpdateStatus,
} = require("../validate/order.validate");

module.exports = function (app) {
  app.get("/order", [authJwt.verifyToken], controller.getList);

  app.get("/order/:id", [authJwt.verifyToken], controller.getOne);

  app.post(
    "/order",
    [authJwt.verifyToken],
    [validate(validateCreate())],
    controller.create
  );

  app.put(
    "/order/:id",
    [authJwt.verifyToken],
    [validate(validateCreate())],
    controller.updateRecord
  );

  app.put(
    "/order/updateStatus/:id",
    [authJwt.verifyToken],
    [validate(validateUpdateStatus())],
    controller.updateStatus
  );

  app.delete("/order/:id", [authJwt.verifyToken], controller.deleteRecord);
};
