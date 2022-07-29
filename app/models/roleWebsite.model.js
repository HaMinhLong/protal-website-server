module.exports = (sequelize, DataTypes) => {
  const RoleWebsite = sequelize.define("roleWebsites", {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      field: "id",
    },
    fullName: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "fullName",
    },
    mobile: {
      type: DataTypes.STRING,
      allowNull: true,
      field: "mobile",
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
      field: "email",
    },
    role: {
      type: DataTypes.STRING,
      allowNull: true,
      field: "role",
    },
    facebook: {
      type: DataTypes.STRING,
      allowNull: true,
      field: "facebook",
    },
    zalo: {
      type: DataTypes.STRING,
      allowNull: true,
      field: "zalo",
    },
    skype: {
      type: DataTypes.STRING,
      allowNull: true,
      field: "skype",
    },
    websiteId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      field: "websiteId",
    },
  });

  return RoleWebsite;
};
