module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define("orders", {
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
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "email",
    },
    address: {
      type: DataTypes.STRING(1000),
      allowNull: false,
      field: "address",
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "description",
    },
    totalPrice: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "totalPrice",
    },
    websiteId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "websiteId",
    },
    paymentMethodId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "paymentMethodId",
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "status",
    },
  });
  Order.sync().then(async () => {});
  return Order;
};
