module.exports = (sequelize, DataTypes) => {
  const Category = sequelize.define("categories", {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      field: "id",
    },
    text: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "text",
    },
    description: {
      type: DataTypes.STRING(1000),
      allowNull: true,
      field: "description",
    },
    url: {
      type: DataTypes.STRING,
      allowNull: true,
      field: "url",
    },
    position: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "position",
    },
    parent: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "parent",
    },
    droppable: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      field: "droppable",
    },
    isHome: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      field: "isHome",
    },
    images: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: "images",
    },
    websiteId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "websiteId",
    },
    categoryGroupId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "categoryGroupId",
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "status",
    },
  });
  Category.sync().then(async () => {});
  return Category;
};
