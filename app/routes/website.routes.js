// PROJECT IMPORT
const { authJwt, uploadImage } = require("../middleware");
const controller = require("../controllers/website.controller");
const { validate } = require("../validate/validate");
const {
  validateCreate,
  validateUpdateStatus,
} = require("../validate/website.validate");

module.exports = function (app) {
  app.get("/website", [authJwt.verifyToken], controller.getList);

  app.get("/website/:id", [authJwt.verifyToken], controller.getOne);

  app.post(
    "/website",
    [authJwt.verifyToken],
    uploadImage.single("logo"),
    controller.create
  );

  app.put(
    "/website/:id",
    [authJwt.verifyToken],
    uploadImage.single("logo"),
    controller.updateRecord
  );

  app.put(
    "/website/updateStatus/:id",
    [authJwt.verifyToken],
    [validate(validateUpdateStatus())],
    controller.updateStatus
  );

  app.delete("/website/:id", [authJwt.verifyToken], controller.deleteRecord);
};
