// PROJECT IMPORT
const { authJwt, verifySignUp, upload } = require("../middleware");
const controller = require("../controllers/user.controller");
const { validate } = require("../validate/validate");
const {
  validateCreate,
  validateUpdateStatus,
  validateChangePasswordLogin,
  validateChangePasswordNotLogin,
} = require("../validate/user.validate");

module.exports = function (app) {
  app.get("/user", [authJwt.verifyToken], controller.getList);

  app.get("/user/:id", [authJwt.verifyToken], controller.getOne);

  app.post(
    "/user",
    [authJwt.verifyToken],
    [validate(validateCreate())],
    [verifySignUp.checkDuplicateUsernameOrEmail],
    controller.create
  );

  // app.post("/user/xlsx", upload.single("file"), controller.createByXLSX);

  app.put(
    "/user/:id",
    [authJwt.verifyToken],
    [validate(validateCreate())],
    controller.updateRecord
  );

  app.put(
    "/user/updateStatus/:id",
    [authJwt.verifyToken],
    [validate(validateUpdateStatus())],
    controller.updateStatus
  );

  app.delete("/user/:id", [authJwt.verifyToken], controller.deleteRecord);

  app.post(
    "/user/changePasswordLogin",
    [authJwt.verifyToken],
    [validate(validateChangePasswordLogin())],
    controller.changePasswordLogin
  );

  app.post(
    "/user/changePasswordNotLogin",
    [authJwt.verifyToken],
    [validate(validateChangePasswordNotLogin())],
    controller.changePasswordNotLogin
  );

  app.post("/user/forgotPassword", controller.forgetPassword);
};
