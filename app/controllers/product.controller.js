// THIRD IMPORT
const moment = require('moment');

// PROJECT IMPORT
const db = require('../models');
const Product = db.product;
const Op = db.Sequelize.Op;
const Website = db.website;
const Category = db.category;
const Producer = db.producer;
const ProductClass1 = db.productClass1;
const ProductClass2 = db.productClass2;
const ProductPrice = db.productPrice;
const CollectionProduct = db.collectionProduct;
const Supplier = db.supplier;
const statusErrors = require('../errors/status-error');
const { QueryTypes } = require('sequelize');
const Sequelize = db.sequelize;

const getList = async(req, res) => {
    const { filter, range, sort, attributes } = req.query;
    const filters = filter ? JSON.parse(filter) : {};
    const ranges = range ? JSON.parse(range) : [0, 20];
    const order = sort ? JSON.parse(sort) : ['createdAt', 'DESC'];
    const attributesQuery = attributes ?
        attributes.split(',') :
        [
            'id',
            'name',
            'url',
            'price',
            'negotiablePrice',
            'description',
            'content',
            'images',
            'websiteId',
            'categoryId',
            'producerId',
            'supplierId',
            'status',
            'isSale',
            'createdAt',
            'updatedAt'
        ];
    const status = filters.status !== undefined ? filters.status : '';
    const name = filters.name || '';
    const url = filters.url || '';
    const websiteId = filters.websiteId || '';
    const categoryId = filters.categoryId || '';
    const producerId = filters.producerId || '';
    const supplierId = filters.supplierId || '';
    const fromDate = filters.fromDate || '2021-01-01T14:06:48.000Z';
    const toDate = filters.toDate || moment();
    const size = ranges[1] - ranges[0];
    const current = Math.floor(ranges[1] / size);

    var options = {
        where: {
            [Op.and]: [
                status !== '' && { status: status },
                { name: {
                        [Op.like]: '%' + name + '%' } },
                websiteId !== '' && { websiteId: websiteId },
                producerId !== '' && { producerId: producerId },
                supplierId !== '' && { supplierId: supplierId }
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
                model: Website,
                required: true,
                attributes: ['id', 'name']
            },
            {
                model: Category,
                required: true,
                attributes: ['id', 'text', 'url'],
                where: {
                    [Op.and]: [
                        { url: {
                                [Op.like]: '%' + url + '%' } },
                        categoryId !== '' && {
                            [Op.or]: [{ id: categoryId }, { parent: categoryId }]
                        }
                    ]
                }
            },
            {
                model: Producer,
                required: true,
                attributes: ['id', 'name']
            },
            {
                model: Supplier,
                required: true,
                attributes: ['id', 'name']
            }
        ]
    };

    Product.findAndCountAll(options)
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
    Product.findOne({
            where: {
                id: id
            },
            include: [{
                    model: Category,
                    required: true,
                    attributes: ['id', 'text']
                },
                {
                    model: Producer,
                    required: true,
                    attributes: ['id', 'name']
                },
                {
                    model: ProductClass1,
                    required: false,
                    attributes: ['id', 'name'],
                    include: [{
                        model: ProductClass2,
                        require: false,
                        attributes: ['id', 'name']
                    }]
                },
                {
                    model: ProductClass2,
                    required: false,
                    attributes: ['id', 'name'],
                    include: [{
                        model: ProductClass1,
                        require: false,
                        attributes: ['id', 'name']
                    }]
                },
                {
                    model: ProductPrice,
                    required: false
                }
            ]
        })
        .then((product) => {
            res.status(statusErrors.success).json({
                results: {
                    list: product
                },
                success: true
            });
        })
        .catch((err) => {
            res.status(statusErrors.badRequest).json({
                success: false,
                error: err.message,
                message: 'Xảy ra lỗi khi lấy thông tin sản phẩm!'
            });
        });
};

const getOneByUrl = async(req, res) => {
    const { url } = req.params;
    Product.findOne({
            where: {
                url: url
            },
            include: [{
                    model: Category,
                    required: true,
                    attributes: ['id', 'text']
                },
                {
                    model: Producer,
                    required: true,
                    attributes: ['id', 'name']
                },
                {
                    model: ProductClass1,
                    required: false,
                    attributes: ['id', 'name'],
                    include: [{
                        model: ProductClass2,
                        require: false,
                        attributes: ['id', 'name']
                    }]
                },
                {
                    model: ProductClass2,
                    required: false,
                    attributes: ['id', 'name'],
                    include: [{
                        model: ProductClass1,
                        require: false,
                        attributes: ['id', 'name']
                    }]
                },
                {
                    model: ProductPrice,
                    required: false
                }
            ]
        })
        .then((product) => {
            res.status(statusErrors.success).json({
                results: {
                    list: product
                },
                success: true
            });
        })
        .catch((err) => {
            res.status(statusErrors.badRequest).json({
                success: false,
                error: err.message,
                message: 'Xảy ra lỗi khi lấy thông tin sản phẩm!'
            });
        });
};

const create = async(req, res) => {
    const data = req.body;

    Product.create({
            ...data
        })
        .then((product) => {
            // PRODUCT CLASS CREATE
            const productClass1Add = data.productClass1s.filter((item) => item.flag === 'add');
            const productClass2Add = data.productClass2s.filter((item) => item.flag === 'add');

            ProductClass1.bulkCreate(
                productClass1Add.map((item) => {
                    return { name: item.name, images: null, productId: product.id };
                })
            ).then((class1) => {
                ProductClass2.bulkCreate(
                    productClass2Add.map((item) => {
                        return { name: item.name, images: null, productId: product.id };
                    })
                ).then((class2) => {
                    const productPricesAdd = data.productPrices.filter((item) => item.flag === 'add');
                    ProductPrice.bulkCreate(
                        productPricesAdd.map((item) => {
                            return {
                                price: item.price,
                                negotiablePrice: item.negotiablePrice,
                                amount: item.amount,
                                productClass1Id: item.productClass1Id,
                                productClass2Id: item.productClass2Id,
                                productId: product.id
                            };
                        })
                    );
                });
            });

            // PRODUCT CLASS CREATE

            res.status(statusErrors.success).json({
                results: {
                    list: product
                },
                success: true,
                message: 'Tạo mới sản phẩm thành công!'
            });
        })
        .catch((err) => {
            res.status(statusErrors.badRequest).json({
                success: false,
                error: err.message,
                message: 'Xảy ra lỗi khi tạo mới sản phẩm!'
            });
        });
};

const updateRecord = async(req, res) => {
    const { id } = req.params;
    const {
        name,
        url,
        price,
        negotiablePrice,
        description,
        content,
        images,
        websiteId,
        categoryId,
        producerId,
        supplierId,
        isSale,
        status,
        productClass1s,
        productClass2s,
        productPrices
    } = req.body;

    Product.update({
            status: status,
            name: name,
            url: url,
            price: price,
            negotiablePrice: negotiablePrice,
            description: description,
            content: content,
            images: images,
            websiteId: websiteId,
            categoryId: categoryId,
            producerId: producerId,
            isSale: isSale,
            supplierId: supplierId
        }, {
            where: {
                id: id
            }
        })
        .then((product) => {
            // PRODUCT CLASS CREATE
            const productClass1Add = productClass1s.filter((item) => item.flag === 'add');
            const productClass2Add = productClass2s.filter((item) => item.flag === 'add');

            ProductClass1.bulkCreate(
                productClass1Add.map((item) => {
                    return {
                        id: item.id,
                        name: item.name,
                        images: null,
                        productId: id
                    };
                })
            ).then((class1) => {
                ProductClass2.bulkCreate(
                    productClass2Add.map((item) => {
                        return {
                            id: item.id,
                            name: item.name,
                            images: null,
                            productId: id
                        };
                    })
                ).then((class2) => {
                    const productPricesAdd = productPrices.filter((item) => item.flag === 'add');

                    ProductPrice.bulkCreate(
                        productPricesAdd.map((item) => {
                            return {
                                price: item.price,
                                negotiablePrice: item.negotiablePrice,
                                amount: item.amount,
                                productClass1Id: item.productClass1Id,
                                productClass2Id: item.productClass2Id,
                                productId: id
                            };
                        })
                    );
                });
            });
            // PRODUCT CLASS CREATE

            // PRODUCT CLASS UPDATE
            const productClass1sUpdate = productClass1s.filter((item) => item.flag !== 'add' && item.flag !== 'delete');
            const productClass2sUpdate = productClass2s.filter((item) => item.flag !== 'add' && item.flag !== 'delete');

            productClass1sUpdate.forEach((item) => {
                ProductClass1.update({
                    name: item.name
                }, {
                    where: {
                        id: item.id
                    }
                });
            });

            productClass2sUpdate.forEach((item) => {
                ProductClass2.update({
                    name: item.name
                }, {
                    where: {
                        id: item.id
                    }
                });
            });
            // PRODUCT CLASS UPDATE

            // PRODUCT PRICE UPDATE
            const productPricesUpdate = productPrices.filter((item) => item.flag !== 'add' && item.flag !== 'delete');
            productPricesUpdate.forEach((item) => {
                ProductPrice.update({
                    price: item.price,
                    negotiablePrice: item.negotiablePrice,
                    amount: item.amount
                }, {
                    where: {
                        id: item.id
                    }
                });
            });
            // PRODUCT PRICE UPDATE

            // PRODUCT CLASS DELETE
            const productClass1Delete = productClass1s.map((item) => {
                if (item.flag === 'delete') return item.id;
            });
            const productClass2Delete = productClass2s.map((item) => {
                if (item.flag === 'delete') return item.id;
            });

            ProductClass1.destroy({
                where: {
                    id: {
                        [Op.in]: productClass1Delete }
                }
            });
            ProductClass2.destroy({
                where: {
                    id: {
                        [Op.in]: productClass2Delete }
                }
            });
            // PRODUCT CLASS DELETE

            // PRODUCT PRICES DELETE
            ProductPrice.destroy({
                where: {
                    [Op.or]: [{
                            productClass1Id: {
                                [Op.in]: productClass1Delete }
                        },
                        {
                            productClass2Id: {
                                [Op.in]: productClass2Delete }
                        }
                    ]
                }
            });
            // PRODUCT PRICES DELETE

            res.status(statusErrors.success).json({
                results: {
                    list: product
                },
                success: true,
                message: 'Cập nhật sản phẩm thành công!'
            });
        })
        .catch((err) => {
            res.status(statusErrors.badRequest).json({
                success: false,
                error: err.message,
                message: 'Xảy ra lỗi khi cập nhật sản phẩm!'
            });
        });
};

const updateStatus = async(req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    Product.update({ status: status }, {
            where: {
                id: id
            }
        })
        .then((product) => {
            res.status(statusErrors.success).json({
                results: {
                    list: product
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
    Product.destroy({
            where: {
                id: id
            }
        })
        .then((product) => {
            ProductClass1.destroy({
                where: {
                    productId: id
                }
            });
            CollectionProduct.destroy({
                where: {
                    productId: id
                }
            });
            ProductClass2.destroy({
                where: {
                    productId: id
                }
            });
            ProductPrice.destroy({
                where: {
                    productId: id
                }
            });
            res.status(statusErrors.success).json({
                results: {
                    list: product
                },
                success: true,
                message: 'Xóa sản phẩm thành công!'
            });
        })
        .catch((err) => {
            res.status(statusErrors.badRequest).json({
                success: false,
                error: err.message,
                message: 'Xảy ra lôi khi xóa sản phẩm!'
            });
        });
};

const getAllProducerProduct = async(req, res) => {
    const { filter } = req.query;
    const filters = JSON.parse(filter || '{}');
    const websiteId = Number(filters.websiteId) || 0;
    const categoryId = Number(filters.categoryId) || 0;

    const producers = await Sequelize.query(
        `SELECT DISTINCT PR.id, PR.name
    FROM products as P
    JOIN producers as PR on P."producerId" = PR.id
    JOIN categories as C on P."categoryId" = C.id
    WHERE P."websiteId" = :websiteId
    AND (C."id" = :categoryId OR C."parent" = :categoryId)
    `, {
            replacements: {
                websiteId: websiteId,
                categoryId: categoryId
            },
            type: QueryTypes.SELECT
        }
    );

    res.status(200).json({
        results: {
            list: producers
        },
        success: true,
        error: '',
        message: ''
    });
};

module.exports = {
    getList,
    getOne,
    getOneByUrl,
    create,
    updateRecord,
    updateStatus,
    deleteRecord,
    getAllProducerProduct
};