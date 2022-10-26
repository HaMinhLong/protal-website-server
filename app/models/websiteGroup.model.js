module.exports = (sequelize, DataTypes) => {
  const WebsiteGroup = sequelize.define("websiteGroups", {
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
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "status",
    },
  });
  WebsiteGroup.sync().then(async () => {});
  return WebsiteGroup;
};
