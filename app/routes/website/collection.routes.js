// PROJECT IMPORT
const controller = require("../../controllers/collection.controller");

module.exports = function (app) {
  app.get("/web/v1/collection", controller.getList);

  app.get("/web/v1/collection/:id", controller.getOne);

  app.get("/web/v1/collection/url/:url", controller.getOneByUrl);
};
