module.exports = (sequelize, DataTypes) => {
  const ProducerGroup = sequelize.define("producerGroups", {
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
  ProducerGroup.sync().then(async () => {});
  return ProducerGroup;
};
