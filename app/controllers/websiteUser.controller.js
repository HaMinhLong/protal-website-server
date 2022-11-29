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
        [Op.and]: [id !== '' && { id: id }],
        include: [{
            model: Website,
            required: true,
            attributes: ['id', 'name']
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
    const { websites } = req.body;

    const productOrdersAdd = data.productOrders.filter((item) => item.flag === 'add');

    res.status(statusErrors.badRequest).json({
        success: false,
        error: '',
        message: 'Xảy ra lỗi khi lấy danh sách!'
    });
};

module.exports = {
    getList,
    grantPermission
};