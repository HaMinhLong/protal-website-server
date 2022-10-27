module.exports = (sequelize, DataTypes) => {
  const Article = sequelize.define("articles", {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      field: "id",
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "title",
    },
    description: {
      type: DataTypes.STRING(1000),
      allowNull: true,
      field: "description",
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: "content",
    },
    url: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "url",
    },
    author: {
      type: DataTypes.STRING,
      allowNull: true,
      field: "author",
    },
    source: {
      type: DataTypes.STRING,
      allowNull: true,
      field: "source",
    },
    label: {
      type: DataTypes.STRING,
      allowNull: true,
      field: "label",
    },
    images: {
      type: DataTypes.STRING,
      allowNull: true,
      field: "images",
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

  return Article;
};
