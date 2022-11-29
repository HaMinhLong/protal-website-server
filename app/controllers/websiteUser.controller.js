// PROJECT IMPORT
const db = require('../models');
const WebsiteUser = db.websiteUser;
const Website = db.website;
const User = db.user;
const Op = db.Sequelize.Op;
const statusErrors = require('../errors/status-error');

const getList = async(req, res) => {
    const { filter } = req.query;
    const filters = filter ? JSON.parse(filter) : {};

    const id = filters.id || '';

    let options = {
        [Op.and]: [id !== '' && { id: id }, { status: 1 }],
        include: [{
            model: Website,
            required: true,
            attributes: ['id', 'name'],
            where: {
                status: 1
            }
        }]
    };

    User.findAndCountAll(options)
        .then((result) => {
            res.status(statusErrors.success).json({
                results: {
                    list: result.rows
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

const grantPermission = async(req, res) => {
    const { id } = req.params;
    const { websites } = req.body;

    const websiteUsersDelete = websites.map((item) => {
        if (item.flag === 'delete') return item.value;
    });
    WebsiteUser.destroy({
        where: {
            [Op.and]: [{
                    websiteId: {
                        [Op.in]: websiteUsersDelete
                    }
                },
                {
                    userId: id
                }
            ]
        }
    });

    const websiteUsersAdd = websites.filter((item) => item.flag === 'add');
    WebsiteUser.bulkCreate(websiteUsersAdd.map((item) => ({ userId: id, websiteId: item.value })))
        .then((order) => {
            res.status(statusErrors.success).json({
                results: {
                    list: order
                },
                success: true,
                message: 'Cập nhật quyền thành công!'
            });
        })
        .catch((err) => {
            res.status(statusErrors.badRequest).json({
                success: false,
                error: err.message,
                message: 'Xảy ra lỗi khi lấy thông tin đơn hàng!'
            });
        });
};

module.exports = {
    getList,
    grantPermission
};