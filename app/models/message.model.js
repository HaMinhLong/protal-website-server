module.exports = (sequelize, DataTypes) => {
  const Message = sequelize.define("messages", {
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
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "phone",
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
      field: "email",
    },
    message: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "message",
    },
    websiteId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "websiteId",
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "status",
    },
  });
  Message.sync().then(async () => {});
  return Message;
};
