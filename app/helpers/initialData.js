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
    id: 1,
    username: "admin",
    fullName: "Hà Minh Long",
    password: bcrypt.hashSync("admin", 8),
    email: "haminhlong3@gmail.com",
    mobile: "0963339657",
    userGroupId: 1,
    status: 1,
  });
  db.websiteGroup.create({
    id: 1,
    name: "Website bán hàng",
    description: "",
    status: 1,
  });
  db.website.create({
    id: 1,
    name: "Naru Shop",
    description: "",
    websiteGroupId: 1,
    status: 1,
  });
  db.menu.create({
    id: 1,
    text: "Trang chủ",
    url: "/",
    icon: "icon",
    position: 1,
    location: 1,
    status: 1,
    parent: 0,
    websiteId: 1,
    categoryId: null,
    articleId: null,
    droppable: true,
    status: 1,
  });
  db.categoryGroup.create({
    id: 1,
    name: "Chuyên mục tin tức",
    description: "",
    status: 1,
  });
  db.categoryGroup.create({
    id: 2,
    name: "Chuyên mục sản phẩm",
    description: "",
    status: 1,
  });
  db.category.create({
    id: 1,
    text: "Trang chủ",
    description: "",
    url: "/",
    position: 1,
    parent: 0,
    droppable: true,
    isHome: false,
    images: "",
    websiteId: 1,
    categoryGroupId: 1,
    status: 1,
  });
  db.producerGroup.create({
    id: 1,
    name: "Nhà sản xuất quần áo",
    description: "",
    status: 1,
  });
  db.producer.create({
    id: 1,
    name: "Nhà sản xuất Bình An",
    description: "",
    producerGroupId: 1,
    status: 1,
  });
  db.supplierGroup.create({
    id: 1,
    name: "Nhà cung cấp quần áo",
    description: "",
    status: 1,
  });
  db.supplier.create({
    id: 1,
    name: "Nhà cung cấp Bình An",
    description: "",
    supplierGroupId: 1,
    status: 1,
  });
  db.paymentMethod.create({
    id: 1,
    name: "Chuyển khoản",
    description: "",
    status: 1,
  });
  db.paymentMethod.create({
    id: 2,
    name: "Thanh toán sau khi nhận hàng",
    description: "",
    status: 1,
  });
};
const initialDataServer = {
  initialData: initialData,
};

module.exports = initialDataServer;
