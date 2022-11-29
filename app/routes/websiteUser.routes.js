// PROJECT IMPORT
const { authJwt } = require('../middleware');
const controller = require('../controllers/websiteUser.controller');

module.exports = function(app) {
    app.get('/website-user', [authJwt.verifyToken], controller.getList);

    app.put('/website-user/:id', [authJwt.verifyToken], controller.grantPermission);
};