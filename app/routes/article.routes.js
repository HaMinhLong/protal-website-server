// PROJECT IMPORT
const { authJwt } = require("../middleware");
const controller = require("../controllers/article.controller");
const { validate } = require("../validate/validate");
const {
  validateCreate,
  validateUpdateStatus,
} = require("../validate/article.validate");

module.exports = function (app) {
  app.get("/article", [authJwt.verifyToken], controller.getList);

  app.get("/article/:id", [authJwt.verifyToken], controller.getOne);

  app.post(
    "/article",
    [authJwt.verifyToken],
    [validate(validateCreate())],
    controller.create
  );

  app.put(
    "/article/:id",
    [authJwt.verifyToken],
    [validate(validateCreate())],
    controller.updateRecord
  );

  app.put(
    "/article/updateStatus/:id",
    [authJwt.verifyToken],
    [validate(validateUpdateStatus())],
    controller.updateStatus
  );

  app.delete("/article/:id", [authJwt.verifyToken], controller.deleteRecord);
};
