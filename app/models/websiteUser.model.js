module.exports = (sequelize, DataTypes) => {
  const WebsiteUser = sequelize.define("websiteUsers", {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      field: "id",
    },
    websiteId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      field: "websiteId",
    },
    userId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      field: "userId",
    },
  });

  return WebsiteUser;
};
