const statusErrors = require("../errors/status-error");

const create = async (req, res) => {
  if (req.file) {
    res.status(statusErrors.success).json({
      results: "/uploads/" + req.file.filename,
      success: true,
      error: "Upload ảnh thành công!",
      message: "Upload ảnh thành công!",
    });
  } else {
    res.status(statusErrors.badRequest).json({
      success: false,
      error: "Xảy ra lỗi khi upload ảnh!",
      message: "Xảy ra lỗi khi upload ảnh!",
    });
  }
};

module.exports = {
  create,
};
