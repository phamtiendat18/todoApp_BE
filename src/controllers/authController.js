const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Users = require("../models/users");
const {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  revokeRefreshToken,
} = require("../services/tokenService");

require("dotenv").config();

//Đăng ký
const register = async (req, res) => {
  const { username, password, email, phone } = req.body;
  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Account and password must not be left blank!" });
  }
  try {
    const existingUser = await Users.findOne({ where: { username } });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await Users.create({
      username,
      password: hashedPassword,
      email,
      phone,
    });

    const token = jwt.sign(
      { id: newUser.id, username: newUser.username },
      process.env.JWT_ACCESS_KEY,
      { expiresIn: "1h" }
    );

    res.status(201).json({ token, message: "Đăng kí thành công" });
  } catch (err) {
    res.status(500).json({ message: "Internal server error", err });
  }
};

//Đăng nhập
const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await Users.findOne({ where: { username } });

    if (!user) {
      return res.status(400).json({ message: "The information is incorrect!" });
    }
    const userInfo = user.dataValues;

    const isMatch = await bcrypt.compare(password, userInfo.password);

    if (!isMatch) {
      return res.status(400).json({ message: "The information is incorrect." });
    }

    const accessToken = generateAccessToken(userInfo.id);

    const refreshToken = await generateRefreshToken(userInfo.id);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true, // Ngăn JavaScript truy cập cookie (giảm nguy cơ XSS)
      secure: false, // Chỉ gửi qua HTTPS
      sameSite: "strict", // Chặn cookie gửi từ domain khác (chống CSRF)
      path: "/",
    });
    const { password: hashedPassword, ...others } = userInfo;

    res.json({
      data: others,
      accessToken: accessToken,
    });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};

const refreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken)
      return res.status(403).json({ message: "You are not authenticated!" });

    const decoded = await verifyRefreshToken(refreshToken);
    const newAccessToken = generateAccessToken(decoded.id);

    res.json({ accessToken: newAccessToken });
  } catch (err) {
    res.status(403).json({ message: err.message });
  }
};

const logout = async () => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken)
    return res.status(401).json({ message: "You are not authenticated!" });

  try {
    await revokeRefreshToken(req.user.id);

    res.clearCookie("refreshToken");
    res.status(200).json({ message: "Logout successfully" });
  } catch (err) {
    res.status(400).json({ message: "Token is not valid!" });
  }
};

module.exports = { register, login, refreshToken, logout };
