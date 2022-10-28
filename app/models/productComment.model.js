module.exports = (sequelize, DataTypes) => {
  const ProductComment = sequelize.define("productComments", {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      field: "id",
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "name",
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "phone",
    },
    rate: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "rate",
    },
    comment: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "comment",
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "productId",
    },
    websiteId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "websiteId",
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "status",
    },
  });
  ProductComment.sync().then(async () => {});
  return ProductComment;
};
