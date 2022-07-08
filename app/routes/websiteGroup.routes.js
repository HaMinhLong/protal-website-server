// PROJECT IMPORT
const { authJwt } = require("../middleware");
const controller = require("../controllers/websiteGroup.controller");
const { validate } = require("../validate/validate");
const {
  validateCreate,
  validateUpdateStatus,
} = require("../validate/websiteGroup.validate");

module.exports = function (app) {
  app.get("/websiteGroup", [authJwt.verifyToken], controller.getList);

  app.get("/websiteGroup/:id", [authJwt.verifyToken], controller.getOne);

  app.post(
    "/websiteGroup",
    [authJwt.verifyToken],
    [validate(validateCreate())],
    controller.create
  );

  app.put(
    "/websiteGroup/:id",
    [authJwt.verifyToken],
    [validate(validateCreate())],
    controller.updateRecord
  );

  app.put(
    "/websiteGroup/updateStatus/:id",
    [authJwt.verifyToken],
    [validate(validateUpdateStatus())],
    controller.updateStatus
  );

  app.delete(
    "/websiteGroup/:id",
    [authJwt.verifyToken],
    controller.deleteRecord
  );
};
