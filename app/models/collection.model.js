module.exports = (sequelize, DataTypes) => {
  const Collection = sequelize.define("collections", {
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
      allowNull: true,
      field: "description",
    },
    websiteId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "websiteId",
    },
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "categoryId",
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "status",
    },
  });
  Collection.sync().then(async () => {});
  return Collection;
};
