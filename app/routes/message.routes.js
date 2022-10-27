// PROJECT IMPORT
const { authJwt } = require("../middleware");
const controller = require("../controllers/message.controller");
const { validate } = require("../validate/validate");
const {
  validateCreate,
  validateUpdateStatus,
} = require("../validate/message.validate");

module.exports = function (app) {
  app.get("/message", [authJwt.verifyToken], controller.getList);

  app.get("/message/:id", [authJwt.verifyToken], controller.getOne);

  app.post(
    "/message",
    [authJwt.verifyToken],
    [validate(validateCreate())],
    controller.create
  );

  app.put(
    "/message/:id",
    [authJwt.verifyToken],
    [validate(validateCreate())],
    controller.updateRecord
  );

  app.put(
    "/message/updateStatus/:id",
    [authJwt.verifyToken],
    [validate(validateUpdateStatus())],
    controller.updateStatus
  );

  app.delete("/message/:id", [authJwt.verifyToken], controller.deleteRecord);
};
