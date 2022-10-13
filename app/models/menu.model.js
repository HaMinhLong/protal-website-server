module.exports = (sequelize, DataTypes) => {
  const menu = sequelize.define("menus", {
    id: {
      type: DataTypes.BIGINT,
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
    url: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "url",
    },
    icon: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "icon",
    },
    position: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: "position",
    },
    location: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "location",
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "status",
    },
    parent: {
      type: DataTypes.BIGINT,
      allowNull: true,
      field: "parent",
    },
    droppable: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      field: "droppable",
    },
    websiteId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      field: "websiteId",
    },
  });
  menu.sync().then(async () => {});
  return menu;
};
