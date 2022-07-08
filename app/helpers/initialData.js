var bcrypt = require("bcryptjs");
initialData = (db) => {
  db.userGroup.create({
    id: 1,
    name: "Quản trị hệ thống",
    description: "",
    status: 1,
  });
  db.userGroup.create({
    id: 2,
    name: "Người dùng",
    description: "",
    status: 1,
  });

  db.user.create({
    id: 12345678911,
    username: "admin",
    fullName: "Hà Minh Long",
    password: bcrypt.hashSync("admin", 8),
    email: "haminhlong3@gmail.com",
    mobile: "0963339657",
    userGroupId: 1,
    status: 1,
  });
  db.websiteGroup.create({
    id: 123456789,
    name: "Website bán hàng",
    description: "",
    status: 1,
  });
  db.website.create({
    id: 123456789,
    name: "Trang Shop",
    description: "",
    websiteGroupId: 123456789,
    status: 1,
  });
};
const initialDataServer = {
  initialData: initialData,
};

module.exports = initialDataServer;
