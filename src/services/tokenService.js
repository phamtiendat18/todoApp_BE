const jwt = require("jsonwebtoken");
const redis = require("../configs/redis");

// Hàm tạo access token
const generateAccessToken = (userId) => {
  console.log();

  return jwt.sign({ id: userId }, process.env.JWT_ACCESS_KEY, {
    expiresIn: "15m",
  });
};

// Hàm tạo refresh token & lưu vào Redis
const generateRefreshToken = async (userId) => {
  const refreshToken = jwt.sign({ id: userId }, process.env.JWT_REFRESH_KEY, {
    expiresIn: "7d",
  });

  // Lưu token vào Redis với TTL 7 ngày
  await redis.set(
    `refreshToken:${userId}`,
    refreshToken,
    "EX",
    7 * 24 * 60 * 60
  );

  return refreshToken;
};

// Hàm xác minh refresh token
const verifyRefreshToken = async (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_KEY);
    const storedToken = await redis.get(`refreshToken:${decoded.id}`);

    if (storedToken !== token) throw new Error("Token is not correct!");

    return decoded;
  } catch (err) {
    throw new Error("Token has expired!");
  }
};

// Hàm xóa refresh token khỏi Redis
const revokeRefreshToken = async (userId) => {
  await redis.del(`refreshToken:${userId}`);
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  revokeRefreshToken,
};
