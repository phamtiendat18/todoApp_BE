require("dotenv").config();
const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(process.env.DB_URL, {
  dialect: "postgres",
  dialectOptions: {
    ssl: {
      require: true, // Bắt buộc sử dụng SSL để kết nối với Neon
      rejectUnauthorized: false, // Cho phép SSL tự ký
    },
  },
  logging: false, // Tắt logging nếu không cần
});

module.exports = sequelize;
