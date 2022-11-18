module.exports = (sequelize, DataTypes) => {
  const ProductOrder = sequelize.define("productOrders", {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      field: "id",
    },
    amount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "amount",
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
    totalPrice: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "totalPrice",
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "category",
    },
    orderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "orderId",
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "productId",
    },
  });

  return ProductOrder;
};
