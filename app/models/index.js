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
db.categoryGroup = require("../models/categoryGroup.model.js")(
  sequelize,
  Sequelize
);
db.category = require("../models/category.model.js")(sequelize, Sequelize);
db.article = require("../models/article.model.js")(sequelize, Sequelize);
db.message = require("../models/message.model.js")(sequelize, Sequelize);
db.producerGroup = require("../models/producerGroup.model.js")(
  sequelize,
  Sequelize
);
db.producer = require("../models/producer.model.js")(sequelize, Sequelize);
db.supplierGroup = require("../models/supplierGroup.model.js")(
  sequelize,
  Sequelize
);
db.supplier = require("../models/supplier.model.js")(sequelize, Sequelize);
db.product = require("../models/product.model.js")(sequelize, Sequelize);
db.paymentMethod = require("../models/paymentMethod.model.js")(
  sequelize,
  Sequelize
);
db.order = require("../models/order.model.js")(sequelize, Sequelize);
db.productOrder = require("./productOrder.model")(sequelize, Sequelize);
db.productComment = require("./productComment.model")(sequelize, Sequelize);
db.productClass1 = require("./productClass1.model")(sequelize, Sequelize);
db.productClass2 = require("./productClass2.model")(sequelize, Sequelize);
db.productPrice = require("./productPrice.model")(sequelize, Sequelize);
db.collection = require("./collection.model")(sequelize, Sequelize);
db.collectionProduct = require("./collectionProduct.model")(
  sequelize,
  Sequelize
);

//
db.collection.belongsToMany(db.product, {
  through: "collectionProducts",
});
db.product.belongsToMany(db.collection, {
  through: "collectionProducts",
});
//

//
db.category.hasMany(db.collection);
db.collection.belongsTo(db.category);
//

//
db.website.hasMany(db.collection);
db.collection.belongsTo(db.website);
//

//
db.productClass1.belongsToMany(db.productClass2, {
  through: "productPrices",
});
db.productClass2.belongsToMany(db.productClass1, {
  through: "productPrices",
});
//

//
db.product.hasMany(db.productPrice);
db.productPrice.belongsTo(db.product);
//

//
db.product.hasMany(db.productClass1);
db.productClass1.belongsTo(db.product);
//

//
db.product.hasMany(db.productClass2);
db.productClass2.belongsTo(db.product);
//

//
db.website.hasMany(db.productComment);
db.productComment.belongsTo(db.website);
//
//
db.product.hasMany(db.productComment);
db.productComment.belongsTo(db.product);
//

//
db.product.belongsToMany(db.order, {
  through: "productOrders",
});
db.order.belongsToMany(db.product, {
  through: "productOrders",
});
//

//
db.website.hasMany(db.order);
db.order.belongsTo(db.website);
//

//
db.paymentMethod.hasMany(db.order);
db.order.belongsTo(db.paymentMethod);
//

//
db.website.hasMany(db.product);
db.product.belongsTo(db.website);
//

//
db.category.hasMany(db.product);
db.product.belongsTo(db.category);
//

//
db.producer.hasMany(db.product);
db.product.belongsTo(db.producer);
//

//
db.supplier.hasMany(db.product);
db.product.belongsTo(db.supplier);
//

//
db.supplierGroup.hasMany(db.supplier);
db.supplier.belongsTo(db.supplierGroup);
//

//
db.producerGroup.hasMany(db.producer);
db.producer.belongsTo(db.producerGroup);
//

//
db.website.hasMany(db.message);
db.message.belongsTo(db.website);
//

//
db.website.hasMany(db.article);
db.article.belongsTo(db.website);
//

//
db.website.hasMany(db.article);
db.article.belongsTo(db.website);
//

//
db.category.hasMany(db.article);
db.article.belongsTo(db.category);
//

//
db.categoryGroup.hasMany(db.category);
db.category.belongsTo(db.categoryGroup);
//

//
db.website.hasMany(db.category);
db.category.belongsTo(db.website);
//

//
db.article.hasMany(db.menu);
db.menu.belongsTo(db.article);
//

//
db.category.hasMany(db.menu);
db.menu.belongsTo(db.category);
//

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
