module.exports = (sequelize, DataTypes) => {
  const Location = sequelize.define("locations", {
    id: {
      type: DataTypes.BIGINT,
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
    mobile: {
      type: DataTypes.STRING,
      allowNull: true,
      field: "mobile",
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
      field: "email",
    },
    bankName: {
      type: DataTypes.STRING,
      allowNull: true,
      field: "bankName",
    },
    address: {
      type: DataTypes.STRING,
      allowNull: true,
      field: "address",
    },
  });

  return Location;
};
