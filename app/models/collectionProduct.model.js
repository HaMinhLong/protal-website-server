module.exports = (sequelize, DataTypes) => {
  const CollectionProduct = sequelize.define("collectionProducts", {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      field: "id",
    },
    collectionId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "collectionId",
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "productId",
    },
  });

  return CollectionProduct;
};
