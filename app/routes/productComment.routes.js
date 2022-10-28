// PROJECT IMPORT
const { authJwt } = require("../middleware");
const controller = require("../controllers/productComment.controller");
const { validate } = require("../validate/validate");
const {
  validateCreate,
  validateUpdateStatus,
} = require("../validate/productComment.validate");

module.exports = function (app) {
  app.get("/productComment", [authJwt.verifyToken], controller.getList);

  app.get("/productComment/:id", [authJwt.verifyToken], controller.getOne);

  app.post(
    "/productComment",
    [authJwt.verifyToken],
    [validate(validateCreate())],
    controller.create
  );

  app.put(
    "/productComment/:id",
    [authJwt.verifyToken],
    [validate(validateCreate())],
    controller.updateRecord
  );

  app.put(
    "/productComment/updateStatus/:id",
    [authJwt.verifyToken],
    [validate(validateUpdateStatus())],
    controller.updateStatus
  );

  app.delete(
    "/productComment/:id",
    [authJwt.verifyToken],
    controller.deleteRecord
  );
};
