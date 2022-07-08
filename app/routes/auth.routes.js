const { authJwt, verifySignUp } = require("../middleware");
const controller = require("../controllers/auth.controller");
const { validate } = require("../validate/validate");
const { validateLogin } = require("../validate/auth.validate");

module.exports = function (app) {
  app.post(
    "/auth/signUp",
    [verifySignUp.checkDuplicateUsernameOrEmail],
    controller.signUp
  );
  app.post("/auth/signIn", [validate(validateLogin())], controller.signIn);
  app.post("/auth/verifyToken", controller.verifyToken);
  app.get("/me", [authJwt.verifyToken], controller.currentUser);
};
