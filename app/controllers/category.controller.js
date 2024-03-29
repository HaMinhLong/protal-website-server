// THIRD IMPORT
const moment = require('moment');

// PROJECT IMPORT
const db = require('../models');
const Category = db.category;
const Website = db.website;
const CategoryGroup = db.categoryGroup;
const Collection = db.collection;
const Op = db.Sequelize.Op;
const statusErrors = require('../errors/status-error');

const getList = async(req, res) => {
    const { filter, range, sort, attributes } = req.query;
    const filters = filter ? JSON.parse(filter) : {};
    const ranges = range ? JSON.parse(range) : [0, 20];
    const order = sort ?
        JSON.parse(sort) :
        [
            ['position', 'ASC'],
            ['updatedAt', 'DESC']
        ];
    const attributesQuery = attributes ?
        attributes.split(',') :
        [
            'id',
            'text',
            'description',
            'url',
            'position',
            'parent',
            'droppable',
            'isHome',
            'images',
            'websiteId',
            'categoryGroupId',
            'status',
            'createdAt',
            'updatedAt'
        ];
    const status = filters.status !== undefined ? filters.status : '';
    const text = filters.text || '';
    const websiteId = filters.websiteId || '';
    const categoryGroupId = filters.categoryGroupId || '';
    const fromDate = filters.fromDate || '2021-01-01T14:06:48.000Z';
    const toDate = filters.toDate || moment();
    const size = ranges[1] - ranges[0];
    const current = Math.floor(ranges[1] / size);

    var options = {
        where: {
            [Op.and]: [
                status !== '' && { status: status },
                { text: {
                        [Op.like]: '%' + text + '%' } },
                websiteId !== '' && { websiteId: websiteId },
                categoryGroupId !== '' && { categoryGroupId: categoryGroupId }
            ],
            createdAt: {
                [Op.between]: [fromDate, toDate]
            }
        },
        order: order,
        attributes: attributesQuery,
        offset: ranges[0],
        limit: size,
        include: [{
                model: Website,
                required: true,
                attributes: ['id', 'name']
            },
            {
                model: CategoryGroup,
                required: true,
                attributes: ['id', 'name']
            }
        ]
    };

    Category.findAndCountAll(options)
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

    Category.findOne({
            where: {
                id: id
            }
        })
        .then((category) => {
            res.status(statusErrors.success).json({
                results: {
                    list: category
                },
                success: true
            });
        })
        .catch((err) => {
            res.status(statusErrors.badRequest).json({
                success: false,
                error: err.message,
                message: 'Xảy ra lỗi khi lấy thông tin chuyên mục!'
            });
        });
};

const getOneByUrl = async(req, res) => {
    const { url } = req.params;
    const { findChild } = req.query;

    Category.findOne({
            where: {
                url: `/${url}`
            },
            include: [{
                model: Collection,
                required: false,
                attributes: ['id', 'name']
            }]
        })
        .then((category) => {
            if (findChild) {
                Category.findAndCountAll({
                        where: {
                            parent: category.id
                        }
                    })
                    .then((child) => {
                        res.status(statusErrors.success).json({
                            results: {
                                list: {
                                    category,
                                    children: child.rows
                                }
                            },
                            success: true,
                            error: '',
                            message: ''
                        });
                    })
                    .catch((err) => {
                        res.status(statusErrors.badRequest).json({
                            success: false,
                            error: err.message,
                            message: 'Xảy ra lỗi khi lấy thông tin chuyên mục!'
                        });
                    });
            } else {
                res.status(statusErrors.success).json({
                    results: {
                        list: category
                    },
                    success: true,
                    error: '',
                    message: ''
                });
            }
        })
        .catch((err) => {
            res.status(statusErrors.badRequest).json({
                success: false,
                error: err.message,
                message: 'Xảy ra lỗi khi lấy thông tin chuyên mục!'
            });
        });
};

const create = async(req, res) => {
    const data = req.body;

    Category.create({
            ...data,
            parent: data.parent || 0,
            droppable: true
        })
        .then((category) => {
            res.status(statusErrors.success).json({
                results: {
                    list: category
                },
                success: true,
                message: 'Tạo mới chuyên mục thành công!'
            });
        })
        .catch((err) => {
            res.status(statusErrors.badRequest).json({
                success: false,
                error: err.message,
                message: 'Xảy ra lỗi khi tạo mới chuyên mục!'
            });
        });
};

const updateRecord = async(req, res) => {
    const { id } = req.params;
    const { text, description, url, isHome, position, images, parent, websiteId, categoryGroupId, status } = req.body;

    Category.update({
            text: text,
            description: description,
            url: url,
            position: position,
            parent: parent,
            isHome: isHome,
            images: images,
            websiteId: websiteId,
            categoryGroupId: categoryGroupId,
            status: status
        }, {
            where: {
                id: id
            }
        })
        .then((category) => {
            res.status(statusErrors.success).json({
                results: {
                    list: category
                },
                success: true,
                message: 'Cập nhật chuyên mục thành công!'
            });
        })
        .catch((err) => {
            res.status(statusErrors.badRequest).json({
                success: false,
                error: err.message,
                message: 'Xảy ra lỗi khi cập nhật chuyên mục!'
            });
        });
};

const updateStatus = async(req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    Category.update({ status: status }, {
            where: {
                id: id
            }
        })
        .then((category) => {
            res.status(statusErrors.success).json({
                results: {
                    list: category
                },
                success: true,
                message: 'Cập nhật trạng thái thành công!'
            });
        })
        .catch((err) => {
            res.status(statusErrors.badRequest).json({
                success: false,
                error: err.message,
                message: 'Xảy ra lỗi khi cập nhật trạng thái'
            });
        });
};

const deleteRecord = async(req, res) => {
    const { id } = req.params;
    Category.destroy({
            where: {
                id: id
            }
        })
        .then((category) => {
            res.status(statusErrors.success).json({
                results: {
                    list: category
                },
                success: true,
                message: 'Xóa chuyên mục thành công!'
            });
        })
        .catch((err) => {
            res.status(statusErrors.badRequest).json({
                success: false,
                error: err.message,
                message: 'Xảy ra lôi khi xóa chuyên mục!'
            });
        });
};

module.exports = {
    getList,
    getOne,
    getOneByUrl,
    create,
    updateRecord,
    updateStatus,
    deleteRecord
};