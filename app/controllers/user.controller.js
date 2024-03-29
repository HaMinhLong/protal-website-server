// THIRD IMPORT
const moment = require('moment');
var bcrypt = require('bcryptjs');
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
const readXlsxFile = require('read-excel-file/node');

// PROJECT IMPORT
const db = require('../models');
const User = db.user;
const UserGroup = db.userGroup;
const Config = db.config;
const Op = db.Sequelize.Op;
const statusErrors = require('../errors/status-error');

const getList = async(req, res) => {
    const { filter, range, sort, attributes } = req.query;
    const filters = filter ? JSON.parse(filter) : {};
    const ranges = range ? JSON.parse(range) : [0, 20];
    const order = sort ? JSON.parse(sort) : ['createdAt', 'DESC'];
    const attributesQuery = attributes ?
        attributes.split(',') :
        ['id', 'username', 'password', 'fullName', 'email', 'userGroupId', 'mobile', 'status', 'createdAt', 'updatedAt'];
    const status = filters.status !== undefined ? filters.status : '';
    const username = filters.username || '';
    const userGroupId = filters.userGroupId || '';
    const fullName = filters.fullName || '';
    const email = filters.email || '';
    const mobile = filters.mobile || '';

    const fromDate = filters.fromDate || '2021-01-01T14:06:48.000Z';
    const toDate = filters.toDate || moment();
    const size = ranges[1] - ranges[0];
    const current = Math.floor(ranges[1] / size);
    var options = {
        where: {
            [Op.and]: [
                { username: {
                        [Op.like]: '%' + username + '%' } },
                { fullName: {
                        [Op.like]: '%' + fullName + '%' } },
                { email: {
                        [Op.like]: '%' + email + '%' } },
                { mobile: {
                        [Op.like]: '%' + mobile + '%' } },
                userGroupId !== '' && { userGroupId: userGroupId },
                status !== '' && { status: status }
            ],
            createdAt: {
                [Op.between]: [fromDate, toDate]
            }
        },
        order: [order],
        attributes: attributesQuery,
        offset: ranges[0],
        limit: size,
        include: [{
            model: UserGroup,
            required: true,
            attributes: ['id', 'name']
        }]
    };

    User.findAndCountAll(options)
        .then((result) => {
            res.status(statusErrors.success).json({
                results: {
                    list: result.rows,
                    pagination: {
                        total: result.count,
                        pageSize: size,
                        current: current
                    }
                },
                success: true
            });
        })
        .catch((err) => {
            res.status(statusErrors.badRequest).json({
                success: false,
                error: err.message,
                message: 'Xảy ra lỗi khi lấy danh sách!'
            });
        });
};

const getOne = async(req, res) => {
    const { id } = req.params;
    User.findOne({
            where: {
                id: id
            },
            include: [{
                model: UserGroup,
                required: true,
                attributes: ['id', 'name']
            }]
        })
        .then((user) => {
            res.status(statusErrors.success).json({
                results: {
                    list: user
                },
                success: true
            });
        })
        .catch((err) => {
            res.status(statusErrors.badRequest).json({
                success: false,
                error: err.message,
                message: 'Xảy ra lỗi khi lấy thông tin tài khoản!'
            });
        });
};

const create = async(req, res) => {
    const { username, fullName, email, mobile, userGroupId, status, password } = req.body;
    const config = await Config.findAll({});
    const mailFrom = config && config[0] && config[0].email ? config[0].email : 'a34526@thanglong.edu.vn';
    const passwordEmail = config && config[0] && config[0].password ? config[0].password : 'Naru+89-K-2';

    User.create({
            status: status,
            username: username,
            fullName: fullName,
            email: email,
            mobile: mobile,
            userGroupId: userGroupId,
            password: bcrypt.hashSync(password, 8)
        })
        .then((user) => {
            var transporter = nodemailer.createTransport(
                smtpTransport({
                    service: 'gmail',
                    auth: {
                        user: mailFrom,
                        pass: passwordEmail
                    }
                })
            );
            var mailOptions = {
                from: mailFrom,
                to: email,
                subject: 'Thông tin đăng nhập',
                text: `Tên đăng nhập: ${username}, Mật khẩu: ${password}`
            };
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.log(error);
                    res.status(statusErrors.badRequest).json({
                        success: false,
                        error: error,
                        message: 'Đã xảy ra lỗi khi gửi email!'
                    });
                } else {
                    res.status(statusErrors.success).json({
                        results: {
                            list: user,
                            pagination: []
                        },
                        success: true,
                        error: info.response,
                        message: 'Tạo mới tài khoản thành công!'
                    });
                }
            });
        })
        .catch((err) => {
            res.status(statusErrors.badRequest).json({
                success: false,
                error: err.message,
                message: 'Xảy ra lỗi khi tạo mới tài khoản!'
            });
        });
};

const updateRecord = async(req, res) => {
    const { id } = req.params;
    const { username, fullName, email, mobile, userGroupId, status } = req.body;

    User.update({
            status: status,
            username: username,
            fullName: fullName,
            email: email,
            mobile: mobile,
            userGroupId: userGroupId
        }, {
            where: {
                id: id
            }
        })
        .then((user) => {
            res.status(statusErrors.success).json({
                results: {
                    list: user
                },
                success: true,
                message: 'Cập nhật tài khoản thành công!'
            });
        })
        .catch((err) => {
            res.status(statusErrors.badRequest).json({
                success: false,
                error: err.message,
                message: 'Xảy ra lỗi khi cập nhật tài khoản!'
            });
        });
};

const updateStatus = async(req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    User.update({ status: status }, {
            where: {
                id: id
            }
        })
        .then((user) => {
            res.status(statusErrors.success).json({
                results: {
                    list: user
                },
                success: true,
                message: 'Cập nhật trạng thái thành công!'
            });
        })
        .catch((err) => {
            res.status(statusErrors.badRequest).json({
                success: false,
                error: err.message,
                message: 'Xảy ra lỗi khi cập nhật trạng thái!'
            });
        });
};

const deleteRecord = async(req, res) => {
    const { id } = req.params;
    User.destroy({
            where: {
                id: id
            }
        })
        .then((user) => {
            res.status(statusErrors.success).json({
                results: {
                    list: user
                },
                success: true,
                message: 'Xóa tài khoản thành công!'
            });
        })
        .catch((err) => {
            res.status(statusErrors.badRequest).json({
                success: false,
                error: err.message,
                message: 'Xảy ra lỗi khi xóa tài khoản!'
            });
        });
};

const changePasswordLogin = (req, res) => {
    const { userId } = req;
    const { newPassword } = req.body;
    User.update({ password: bcrypt.hashSync(newPassword, 8), status: 1 }, {
            where: {
                id: userId
            }
        })
        .then((user) => {
            res.status(statusErrors.success).json({
                results: {
                    list: user
                },
                success: true,
                message: 'Đổi mật khẩu thành công!'
            });
        })
        .catch((err) => {
            res.status(statusErrors.badRequest).json({
                success: false,
                error: err.message,
                message: 'Xảy ra lỗi khi đổi mật khẩu!'
            });
        });
};

const changePasswordNotLogin = async(req, res) => {
    const { username, newPassword } = req.body;

    User.update({ password: bcrypt.hashSync(newPassword, 8), status: 1 }, {
            where: {
                username: username
            }
        })
        .then((user) => {
            res.status(statusErrors.success).json({
                results: {
                    list: user
                },
                success: true,
                message: 'Đổi mật khẩu thành công!'
            });
        })
        .catch((err) => {
            res.status(statusErrors.badRequest).json({
                success: false,
                error: err.message,
                message: 'Xảy ra lỗi khi đổi mật khẩu!'
            });
        });
};

const forgetPassword = async(req, res) => {
    const { emailTo, subject } = req.body;
    const user = await User.findOne({
        where: {
            email: emailTo
        }
    });
    const config = await Config.findAll({});
    const mailFrom = config && config[0] && config[0].email ? config[0].email : 'a34526@thanglong.edu.vn';
    const password = config && config[0] && config[0].password ? config[0].password : 'Na+89-K-2';

    if (!user) {
        res.status(statusErrors.badRequest).json({
            success: false,
            error: 'Vui lòng nhập đúng email tài khoản của bạn!',
            message: 'Vui lòng nhập đúng email tài khoản của bạn!'
        });
    } else {
        var transporter = nodemailer.createTransport(
            smtpTransport({
                service: 'gmail',
                auth: {
                    user: mailFrom,
                    pass: password
                }
            })
        );
        const passwordReset = Math.random().toString(36).substr(2, 10);
        var mailOptions = {
            from: mailFrom,
            to: emailTo,
            subject: subject,
            text: `Mật khẩu của bạn đã được thay đổi thành ${passwordReset}`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error);
                res.status(statusErrors.badRequest).json({
                    success: false,
                    error: error,
                    message: 'Đã xảy ra lỗi khi gửi email tới bạn!'
                });
            } else {
                res.status(statusErrors.success).json({
                    success: true,
                    error: info.response,
                    message: 'Mật khẩu mới đã được gửi tới email của bạn!'
                });
                User.update({ password: bcrypt.hashSync(passwordReset, 8) }, {
                    where: {
                        email: emailTo
                    }
                });
            }
        });
    }
};

module.exports = {
    getList,
    getOne,
    create,
    updateRecord,
    updateStatus,
    deleteRecord,
    changePasswordLogin,
    changePasswordNotLogin,
    forgetPassword
};

// const createByXLSX = async (req, res) => {
//   try {
//     if (req.file == undefined) {
//       return res.status(statusErrors.badRequest).json({
//         success: false,
//         error: "Vui lòng chọn file cần upload!",
//         message: "Vui lòng chọn file cần upload!",
//       });
//     }

//     let path = "/uploads/" + req.file.filename;

//     readXlsxFile(path).then(async (rows) => {
//       // skip header
//       rows.shift();
//       const config = await Config.findAll({});
//       const mailFrom =
//         config && config[0] && config[0].email
//           ? config[0].email
//           : "a34526@thanglong.edu.vn";
//       const passwordEmail =
//         config && config[0] && config[0].password
//           ? config[0].password
//           : "Na+89-K-2";

//       rows.forEach(async (row) => {
//         let user = {
//           id:
//             Math.floor(Math.random() * (100000000000 - 1000000000 + 1)) +
//             100000000000,
//           username: row[0],
//           password: bcrypt.hashSync(row[1], 8),
//           fullName: row[2],
//           email: row[3],
//           mobile: row[4],
//           userGroupId: 114427096293,
//           status: -2,
//         };
//         const usernameExits = await User.findOne({
//           where: {
//             username: row[0],
//           },
//         });
//         const emailExits = await User.findOne({
//           where: {
//             email: row[3],
//           },
//         });
//         if (!usernameExits && !emailExits) {
//           User.create(user)
//             .then((user) => {
//               var transporter = nodemailer.createTransport(
//                 smtpTransport({
//                   service: "gmail",
//                   auth: {
//                     user: mailFrom,
//                     pass: passwordEmail,
//                   },
//                 })
//               );
//               var mailOptions = {
//                 from: mailFrom,
//                 to: email,
//                 subject: "Thông tin đăng nhập",
//                 text: `Tên đăng nhập: ${row[0]}, Mật khẩu: ${row[1]}`,
//               };
//               transporter.sendMail(mailOptions, (error, info) => {});
//             })
//             .catch((err) => {
//               console.log("error", err);
//             });
//         } else {
//           console.log("Tên tài khoản hoặc email đã được sử dụng!");
//         }
//       });

//       res.status(statusErrors.success).json({
//         success: true,
//         error: "Tải tệp lên thành công!",
//         message: "Tải tệp lên thành công!",
//       });
//       // Tutorial.bulkCreate(tutorials)
//       //   .then(() => {
//       //     res.status(statusErrors.success).send({
//       //       message: "Uploaded the file successfully: " + req.file.originalname,
//       //     });
//       //   })
//       //   .catch((error) => {
//       //     res.status(500).send({
//       //       message: "Fail to import data into database!",
//       //       error: error.message,
//       //     });
//       //   });
//     });
//   } catch (error) {
//     res.status(statusErrors.badRequest).send({
//       message: "Could not upload the file: " + req.file.originalname,
//     });
//   }
// };