module.exports = (sequelize, DataTypes) => {
  const Producer = sequelize.define("producers", {
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
    producerGroupId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "producerGroupId",
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "status",
    },
  });
  Producer.sync().then(async () => {});
  return Producer;
};
