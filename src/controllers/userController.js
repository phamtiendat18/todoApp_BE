const Users = require("../models/users");

const cloudinary = require("../configs/cloudinary");

const getMyProfile = async (req, res) => {
  try {
    const userId = req.user.id; // Lấy user ID từ middleware
    const user = await Users.findByPk(userId);

    if (!user) {
      return res.status(404).json({ message: "Người dùng khôn   g tồn tại" });
    }
    const { password, ...other } = user;
    res.status(200).json({ other, message: "get information success!" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

const uploadAvatar = async (req, res) => {
  try {
    const userId = req.user.id; // Lấy ID user từ token
    const user = await Users.findByPk(userId);

    if (!user) return res.status(404).json({ error: "User not found!" });

    // Nếu có avatar cũ, xóa ảnh cũ trên Cloudinary
    if (user.avatar_url) {
      const publicId = user.avatar_url.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(`avatars/${publicId}`);
    }

    // Upload ảnh mới
    console.log(req.file);

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "avatars", // Lưu ảnh trong thư mục 'avatars'
      transformation: [{ width: 200, height: 200, crop: "fill" }], // Resize ảnh về 200x200
    });

    // Cập nhật avatar mới vào database
    user.avatar_url = result.secure_url;
    await user.save();

    res.json({ message: "Upload successful!", avatar_url: result.secure_url });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Upload failed!" });
  }
};

module.exports = { uploadAvatar, getMyProfile };
