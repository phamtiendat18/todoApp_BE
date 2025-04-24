const { DataTypes } = require("sequelize");
const sequelize = require("../configs/database");

const Users = sequelize.define(
  "users",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: true,
    },
    phone: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    avatar_url: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    timestamps: true,
    underscored: true,
  }
);

module.exports = Users;
