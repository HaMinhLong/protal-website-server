module.exports = (sequelize, DataTypes) => {
  const WebsiteUser = sequelize.define("websiteUsers", {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      field: "id",
    },
    websiteId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "websiteId",
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "userId",
    },
  });

  return WebsiteUser;
};
