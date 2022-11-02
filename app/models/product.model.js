module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define("products", {
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
    url: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "url",
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "price",
    },
    negotiablePrice: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: "negotiablePrice",
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
      field: "description",
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: "content",
    },
    images: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: "images",
    },
    isSale: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      field: "isSale",
    },
    websiteId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "websiteId",
    },
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "categoryId",
    },
    producerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "producerId",
    },
    supplierId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "supplierId",
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "status",
    },
  });
  Product.sync().then(async () => {});
  return Product;
};
