// PROJECT IMPORT
const { authJwt } = require("../middleware");
const controller = require("../controllers/supplierGroup.controller");
const { validate } = require("../validate/validate");
const {
  validateCreate,
  validateUpdateStatus,
} = require("../validate/supplierGroup.validate");

module.exports = function (app) {
  app.get("/supplierGroup", [authJwt.verifyToken], controller.getList);

  app.get("/supplierGroup/:id", [authJwt.verifyToken], controller.getOne);

  app.post(
    "/supplierGroup",
    [authJwt.verifyToken],
    [validate(validateCreate())],
    controller.create
  );

  app.put(
    "/supplierGroup/:id",
    [authJwt.verifyToken],
    [validate(validateCreate())],
    controller.updateRecord
  );

  app.put(
    "/supplierGroup/updateStatus/:id",
    [authJwt.verifyToken],
    [validate(validateUpdateStatus())],
    controller.updateStatus
  );

  app.delete(
    "/supplierGroup/:id",
    [authJwt.verifyToken],
    controller.deleteRecord
  );
};
