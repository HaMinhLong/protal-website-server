module.exports = (sequelize, DataTypes) => {
  const ProductClass1 = sequelize.define("productClass1", {
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
    images: {
      type: DataTypes.STRING,
      allowNull: true,
      field: "images",
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "productId",
    },
  });
  ProductClass1.sync().then(async () => {});
  return ProductClass1;
};
