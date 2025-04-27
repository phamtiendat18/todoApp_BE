const Users = require("../models/users");

const cloudinary = require("../configs/cloudinary");
const { Sequelize, Op } = require("sequelize");

const getMyProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await Users.findByPk(userId);

    if (!user) {
      return res.status(404).json({ message: "Người dùng không tồn tại" });
    }
    const { password, ...other } = user.dataValues;
    res.status(200).json({ other, message: "get information success!" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

const uploadAvatar = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await Users.findByPk(userId);

    if (!user) return res.status(404).json({ error: "User not found!" });
    if (user.avatar_url) {
      const publicId = user.avatar_url.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(`avatars/${publicId}`);
    }

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "avatars",
      transformation: [{ width: 200, height: 200, crop: "fill" }],
    });
    user.avatar_url = result.secure_url;
    await user.save();

    res.json({ message: "Upload successful!", avatar_url: result.secure_url });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Upload failed!" });
  }
};

const searchUsers = async (req, res) => {
  try {
    const { username } = req.query;

    if (!username) {
      return res.status(400).json({ error: "Thiếu tham số username" });
    }

    const users = await Users.findAll({
      where: {
        username: {
          [Op.iLike]: `%${username}%`,
        },
      },
      attributes: ["id", "username", "email"],
      limit: 10,
    });

    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Không thể tìm kiếm người dùng" });
  }
};

module.exports = { uploadAvatar, getMyProfile, searchUsers };
