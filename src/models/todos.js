const { DataTypes } = require("sequelize");
const sequelize = require("../configs/database");
const Users = require("./users");

const Todos = sequelize.define(
  "todos",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
    },
    description: {
      type: DataTypes.TEXT,
    },
    owner_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    timestamps: true,
    underscored: true,
  }
);
Todos.belongsTo(Users, { foreignKey: "owner_id", onDelete: "CASCADE" });

module.exports = Todos;
