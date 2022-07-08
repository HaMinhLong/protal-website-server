module.exports = {
  HOST: "ec2-3-222-74-92.compute-1.amazonaws.com",
  USER: "gfbecvlyffrcmf",
  PASSWORD: "6ef4f76c4855e1c31f29db1aefa8cfda80bf7a08b393198e553de5719f4781fe",
  DB: "d79p1r066ql6oq",
  dialect: "postgres",

  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
};

// module.exports = {
//   HOST: "sql6.freesqldatabase.com",
//   USER: "sql6504095",
//   PASSWORD: "5Tqw1kFLQk",
//   DB: "sql6504095",
//   dialect: "mysql",
//   pool: {
//     max: 5,
//     min: 0,
//     acquire: 30000,
//     idle: 10000,
//   },
// };
