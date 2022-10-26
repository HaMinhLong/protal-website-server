// PROJECT IMPORT
const { authJwt, uploadImage } = require("../middleware");
const controller = require("../controllers/uploadImage.controller");

module.exports = function (app) {
  app.post(
    "/upload",
    [authJwt.verifyToken],
    uploadImage.single("image"),
    controller.create
  );
};
