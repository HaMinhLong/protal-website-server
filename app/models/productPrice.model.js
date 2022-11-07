module.exports = (sequelize, DataTypes) => {
  const ProductPrice = sequelize.define("productPrices", {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      field: "id",
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "price",
    },
    negotiablePrice: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "negotiablePrice",
    },
    amount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "amount",
    },
    productClass1Id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "productClass1Id",
    },
    productClass2Id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "productClass2Id",
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "productId",
    },
  });
  ProductPrice.sync().then(async () => {});
  return ProductPrice;
};
