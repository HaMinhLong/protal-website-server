// PROJECT IMPORT
const { authJwt, uploadImage } = require("../middleware");
const controller = require("../controllers/category.controller");
const { validate } = require("../validate/validate");
const {
  validateCreate,
  validateUpdateStatus,
} = require("../validate/category.validate");

module.exports = function (app) {
  app.get("/category", [authJwt.verifyToken], controller.getList);

  app.get("/category/:id", [authJwt.verifyToken], controller.getOne);

  app.post(
    "/category",
    [authJwt.verifyToken],
    [validate(validateCreate())],
    controller.create
  );

  app.put(
    "/category/:id",
    [authJwt.verifyToken],
    [validate(validateCreate())],
    controller.updateRecord
  );

  app.put(
    "/category/updateStatus/:id",
    [authJwt.verifyToken],
    [validate(validateUpdateStatus())],
    controller.updateStatus
  );

  app.delete("/category/:id", [authJwt.verifyToken], controller.deleteRecord);
};
