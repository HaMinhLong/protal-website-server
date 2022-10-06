module.exports = (sequelize, DataTypes) => {
  const menu = sequelize.define("menus", {
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
    parentId: {
      type: DataTypes.BIGINT,
      hierarchy: true,
      allowNull: true,
      field: "parentId",
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
