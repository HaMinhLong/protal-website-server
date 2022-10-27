module.exports = (sequelize, DataTypes) => {
  const Supplier = sequelize.define("suppliers", {
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
    description: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "description",
    },
    supplierGroupId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "supplierGroupId",
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "status",
    },
  });
  Supplier.sync().then(async () => {});
  return Supplier;
};
