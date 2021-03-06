const config = require("../config/db.config.js");
const initialDataServer = require("../helpers/initialData.js");

const Sequelize = require("sequelize-hierarchy")();
const sequelize = new Sequelize({
  database: config.DB,
  username: config.USER,
  password: config.PASSWORD,
  host: config.HOST,
  port: 5432,
  dialect: config.dialect,
  // operatorsAliases: false,
  dialectOptions: {
    ssl: {
      require: true, // This will help you. But you will see nwe error
      rejectUnauthorized: false, // This line will fix new error
    },
  },

  pool: {
    max: config.pool.max,
    min: config.pool.min,
    acquire: config.pool.acquire,
    idle: config.pool.idle,
  },
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.config = require("../models/config.model.js")(sequelize, Sequelize);
db.userGroup = require("../models/userGroup.model.js")(sequelize, Sequelize);
db.user = require("../models/user.model.js")(sequelize, Sequelize);
db.websiteGroup = require("../models/websiteGroup.model.js")(
  sequelize,
  Sequelize
);
db.website = require("../models/website.model.js")(sequelize, Sequelize);
db.menu = require("../models/menu.model.js")(sequelize, Sequelize);
db.location = require("../models/location.model.js")(sequelize, Sequelize);
db.roleWebsite = require("../models/roleWebsite.model.js")(
  sequelize,
  Sequelize
);
db.websiteUser = require("./websiteUser.model")(sequelize, Sequelize);

//
db.website.hasMany(db.menu);
db.menu.belongsTo(db.website);
//

//
db.websiteGroup.hasMany(db.website);
db.website.belongsTo(db.websiteGroup);
//

//
db.website.hasMany(db.location);
db.location.belongsTo(db.website);
//

db.website.hasMany(db.roleWebsite);
db.roleWebsite.belongsTo(db.website);
//

//
db.website.belongsToMany(db.user, {
  through: "websiteUsers",
});
db.user.belongsToMany(db.website, {
  through: "websiteUsers",
});
//

//
db.userGroup.hasMany(db.user);
db.user.belongsTo(db.userGroup);
//

// initialDataServer.initialData(db);

module.exports = db;
