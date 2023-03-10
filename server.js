const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

global.__basedir = __dirname;

const app = express();

app.use(express.json());
app.use(cors());

app.use((req, res, next) => {
  const allowedOrigins = [
    'http://localhost:3000',
    'https://protal-website.herokuapp.com',
    'https://cms.naru.software',
    'https://tunganh.naru.software'
  ];
  const origin = req.headers.origin;

  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'access-token, Origin, Content-Type, Accept');

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);

  // Pass to next layer of middleware
  next();
});

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static('public'));
app.set('view engine', 'ejs');

// database
const db = require('./app/models');

db.sequelize.sync();
// force: true will drop the table if it already exists
// db.sequelize.sync({ force: true }).then(() => {
//   console.log("Drop and Resync Database with { force: true }");
// });

// simple route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to protal website server application.' });
});

// routes
require('./app/routes/auth.routes')(app);
require('./app/routes/config.routes')(app);
require('./app/routes/user.routes')(app);
require('./app/routes/userGroup.routes')(app);
require('./app/routes/website.routes')(app);
require('./app/routes/websiteGroup.routes')(app);
require('./app/routes/menu.routes')(app);
require('./app/routes/categoryGroup.routes')(app);
require('./app/routes/category.routes')(app);
require('./app/routes/uploadImage.routes')(app);
require('./app/routes/article.routes')(app);
require('./app/routes/message.routes')(app);
require('./app/routes/producerGroup.routes')(app);
require('./app/routes/producer.routes')(app);
require('./app/routes/supplierGroup.routes')(app);
require('./app/routes/supplier.routes')(app);
require('./app/routes/product.routes')(app);
require('./app/routes/paymentMethod.routes')(app);
require('./app/routes/order.routes')(app);
require('./app/routes/productComment.routes')(app);
require('./app/routes/location.routes')(app);
require('./app/routes/collection.routes')(app);
require('./app/routes/websiteUser.routes')(app);

// WEBSITE
require('./app/routes/website/article.routes')(app);
require('./app/routes/website/category.routes')(app);
require('./app/routes/website/menu.routes')(app);
require('./app/routes/website/product.routes')(app);
require('./app/routes/website/order.routes')(app);
require('./app/routes/website/paymentMethod.routes')(app);
require('./app/routes/website/productComment.routes')(app);
require('./app/routes/website/location.routes')(app);
require('./app/routes/website/message.routes')(app);
require('./app/routes/website/collection.routes')(app);

// set port, listen for requests
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
