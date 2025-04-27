const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const sequelize = require("./src/configs/database");
const authRoutes = require("./src/routes/authRoutes");
const profileRoutes = require("./src/routes/profileRoutes");
const todoRoutes = require("./src/routes/todoRoutes");
const shareTodoRoutes = require("./src/routes/shareTodoRoutes");
const userRoutes = require("./src/routes/userRoutes");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(cookieParser());

// Route
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/todos", todoRoutes);
app.use("/api/v1/share-todo", shareTodoRoutes);
app.use("/api/v1/my-profile", profileRoutes);
app.use("/api/v1/users", userRoutes);

const PORT = process.env.PORT;
sequelize
  .authenticate()
  .then(() => {
    console.log("Database connected...");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("Error: " + err);
  });
