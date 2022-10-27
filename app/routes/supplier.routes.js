// PROJECT IMPORT
const { authJwt } = require("../middleware");
const controller = require("../controllers/supplier.controller");
const { validate } = require("../validate/validate");
const {
  validateCreate,
  validateUpdateStatus,
} = require("../validate/supplier.validate");

module.exports = function (app) {
  app.get("/supplier", [authJwt.verifyToken], controller.getList);

  app.get("/supplier/:id", [authJwt.verifyToken], controller.getOne);

  app.post(
    "/supplier",
    [authJwt.verifyToken],
    [validate(validateCreate())],
    controller.create
  );

  app.put(
    "/supplier/:id",
    [authJwt.verifyToken],
    [validate(validateCreate())],
    controller.updateRecord
  );

  app.put(
    "/supplier/updateStatus/:id",
    [authJwt.verifyToken],
    [validate(validateUpdateStatus())],
    controller.updateStatus
  );

  app.delete("/supplier/:id", [authJwt.verifyToken], controller.deleteRecord);
};
