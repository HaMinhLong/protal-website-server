module.exports = (sequelize, DataTypes) => {
  const CategoryGroup = sequelize.define("categoryGroups", {
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
  CategoryGroup.sync().then(async () => {});
  return CategoryGroup;
};
