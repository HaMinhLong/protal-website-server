// PROJECT IMPORT
const { authJwt } = require("../middleware");
const controller = require("../controllers/collection.controller");
const { validate } = require("../validate/validate");
const {
  validateCreate,
  validateUpdateStatus,
} = require("../validate/collection.validate");

module.exports = function (app) {
  app.get("/collection", [authJwt.verifyToken], controller.getList);

  app.get("/collection/:id", [authJwt.verifyToken], controller.getOne);

  app.post(
    "/collection",
    [authJwt.verifyToken],
    [validate(validateCreate())],
    controller.create
  );

  app.put(
    "/collection/:id",
    [authJwt.verifyToken],
    [validate(validateCreate())],
    controller.updateRecord
  );

  app.put(
    "/collection/updateStatus/:id",
    [authJwt.verifyToken],
    [validate(validateUpdateStatus())],
    controller.updateStatus
  );

  app.delete("/collection/:id", [authJwt.verifyToken], controller.deleteRecord);
};
