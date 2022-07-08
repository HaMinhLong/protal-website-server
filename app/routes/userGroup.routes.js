// PROJECT IMPORT
const { authJwt } = require("../middleware");
const controller = require("../controllers/userGroup.controller");
const { validate } = require("../validate/validate");
const {
  validateCreate,
  validateUpdateStatus,
} = require("../validate/userGroup.validate");

module.exports = function (app) {
  app.get("/userGroup", [authJwt.verifyToken], controller.getList);

  app.get("/userGroup/:id", [authJwt.verifyToken], controller.getOne);

  app.post(
    "/userGroup",
    [authJwt.verifyToken],
    [validate(validateCreate())],
    controller.create
  );

  app.put(
    "/userGroup/:id",
    [authJwt.verifyToken],
    [validate(validateCreate())],
    controller.updateRecord
  );

  app.put(
    "/userGroup/updateStatus/:id",
    [authJwt.verifyToken],
    [validate(validateUpdateStatus())],
    controller.updateStatus
  );

  app.delete("/userGroup/:id", [authJwt.verifyToken], controller.deleteRecord);
};
