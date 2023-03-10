var fs = require('fs');
const statusErrors = require('../errors/status-error');

const create = async (req, res) => {
  if (req.file) {
    res.status(statusErrors.success).json({
      results: '/uploads/' + req.file.filename,
      success: true,
      error: 'Upload ảnh thành công!',
      message: 'Upload ảnh thành công!'
    });
  } else {
    res.status(statusErrors.badRequest).json({
      success: false,
      error: 'Xảy ra lỗi khi upload ảnh!',
      message: 'Xảy ra lỗi khi upload ảnh!'
    });
  }
};

const destroy = async (req, res) => {
  const { image } = req.body;

  //file exists
  fs.unlinkSync(__basedir + '/public' + image, function (err) {
    if (err)
      res.status(statusErrors.badRequest).json({
        success: false,
        message: 'Xảy ra lỗi khi xóa ảnh!'
      });
    res.status(statusErrors.success).json({
      success: true,
      message: 'Xóa ảnh thành công!'
    });
  });
};

module.exports = {
  create,
  destroy
};
