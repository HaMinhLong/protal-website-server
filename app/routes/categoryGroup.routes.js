// PROJECT IMPORT
const { authJwt } = require("../middleware");
const controller = require("../controllers/categoryGroup.controller");
const { validate } = require("../validate/validate");
const {
  validateCreate,
  validateUpdateStatus,
} = require("../validate/categoryGroup.validate");

module.exports = function (app) {
  app.get("/categoryGroup", [authJwt.verifyToken], controller.getList);

  app.get("/categoryGroup/:id", [authJwt.verifyToken], controller.getOne);

  app.post(
    "/categoryGroup",
    [authJwt.verifyToken],
    [validate(validateCreate())],
    controller.create
  );

  app.put(
    "/categoryGroup/:id",
    [authJwt.verifyToken],
    [validate(validateCreate())],
    controller.updateRecord
  );

  app.put(
    "/categoryGroup/updateStatus/:id",
    [authJwt.verifyToken],
    [validate(validateUpdateStatus())],
    controller.updateStatus
  );

  app.delete(
    "/categoryGroup/:id",
    [authJwt.verifyToken],
    controller.deleteRecord
  );
};
