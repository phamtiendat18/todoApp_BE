const { DataTypes } = require("sequelize");
const sequelize = require("../configs/database");
const Todos = require("./todos");
const Users = require("./users");

const SharedTodo = sequelize.define(
  "shared_todos",
  {
    todo_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    shared_with: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    permission: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: ["view"],
    },
  },
  {
    timestamps: true,
    underscored: true,
  }
);
SharedTodo.belongsTo(Todos, { foreignKey: "todo_id", onDelete: "CASCADE" });
SharedTodo.belongsTo(Users, { foreignKey: "shared_with", onDelete: "CASCADE" });

module.exports = SharedTodo;
