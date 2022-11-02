// THIRD IMPORT
const moment = require("moment");

// PROJECT IMPORT
const db = require("../models");
const Product = db.product;
const Op = db.Sequelize.Op;
const Website = db.website;
const Category = db.category;
const Producer = db.producer;
const Supplier = db.supplier;
const statusErrors = require("../errors/status-error");
const { QueryTypes } = require("sequelize");
const Sequelize = db.sequelize;

const getList = async (req, res) => {
  const { filter, range, sort, attributes } = req.query;
  const filters = filter ? JSON.parse(filter) : {};
  const ranges = range ? JSON.parse(range) : [0, 20];
  const order = sort ? JSON.parse(sort) : ["createdAt", "DESC"];
  const attributesQuery = attributes
    ? attributes.split(",")
    : [
        "id",
        "name",
        "url",
        "price",
        "negotiablePrice",
        "description",
        "content",
        "images",
        "websiteId",
        "categoryId",
        "producerId",
        "supplierId",
        "status",
        "isSale",
        "createdAt",
        "updatedAt",
      ];
  const status = filters.status !== undefined ? filters?.status : "";
  const name = filters.name || "";
  const url = filters.url || "";
  const websiteId = filters.websiteId || "";
  const categoryId = filters.categoryId || "";
  const producerId = filters.producerId || "";
  const supplierId = filters.supplierId || "";
  const fromDate = filters.fromDate || "2021-01-01T14:06:48.000Z";
  const toDate = filters.toDate || moment();
  const size = ranges[1] - ranges[0];
  const current = Math.floor(ranges[1] / size);

  var options = {
    where: {
      [Op.and]: [
        status !== "" && { status: status },
        { name: { [Op.like]: "%" + name + "%" } },
        websiteId !== "" && { websiteId: websiteId },
        categoryId !== "" && { categoryId: categoryId },
        producerId !== "" && { producerId: producerId },
        supplierId !== "" && { supplierId: supplierId },
      ],
      createdAt: {
        [Op.between]: [fromDate, toDate],
      },
    },
    order: [order],
    attributes: attributesQuery,
    offset: ranges[0],
    limit: size,
    include: [
      {
        model: Website,
        required: true,
        attributes: ["id", "name"],
      },
      {
        model: Category,
        required: true,
        attributes: ["id", "text", "url"],
        where: {
          [Op.and]: [
            { url: { [Op.like]: "%" + url + "%" } },
            categoryId !== "" && {
              [Op.or]: [{ id: categoryId }, { parent: categoryId }],
            },
          ],
        },
      },
      {
        model: Producer,
        required: true,
        attributes: ["id", "name"],
      },
      {
        model: Supplier,
        required: true,
        attributes: ["id", "name"],
      },
    ],
  };

  Product.findAndCountAll(options)
    .then((result) => {
      res.status(statusErrors.success).json({
        results: {
          list: result.rows,
          pagination: {
            total: result.count,
            pageSize: size,
            current: current,
          },
        },
        success: true,
        error: "",
        message: "",
      });
    })
    .catch((err) => {
      res.status(statusErrors.badRequest).json({
        success: false,
        error: err.message,
        message: "Xảy ra lỗi khi lấy danh sách!",
      });
    });
};

const getOne = async (req, res) => {
  const { id } = req.params;
  Product.findOne({
    where: {
      id: id,
    },
    include: [
      {
        model: Category,
        required: true,
        attributes: ["id", "text"],
      },
    ],
  })
    .then((product) => {
      res.status(statusErrors.success).json({
        results: {
          list: product,
          pagination: [],
        },
        success: true,
        error: "",
        message: "",
      });
    })
    .catch((err) => {
      res.status(statusErrors.badRequest).json({
        success: true,
        error: err.message,
        message: "Xảy ra lỗi khi lấy thông tin sản phẩm!",
      });
    });
};

const getOneByUrl = async (req, res) => {
  const { url } = req.params;
  Product.findOne({
    where: {
      url: url,
    },
  })
    .then((menu) => {
      res.status(statusErrors.success).json({
        results: {
          list: menu,
        },
        success: true,
        error: "",
        message: "",
      });
    })
    .catch((err) => {
      res.status(statusErrors.badRequest).json({
        success: true,
        error: err.message,
        message: "Xảy ra lỗi khi lấy thông tin sản phẩm!",
      });
    });
};

const create = async (req, res) => {
  const data = req.body;

  Product.create({
    ...data,
  })
    .then((product) => {
      res.status(statusErrors.success).json({
        results: {
          list: product,
          pagination: [],
        },
        success: true,
        error: "",
        message: "Tạo mới sản phẩm thành công!",
      });
    })
    .catch((err) => {
      res.status(statusErrors.badRequest).json({
        success: false,
        error: err.message,
        message: "Xảy ra lỗi khi tạo mới sản phẩm!",
      });
    });
};

const updateRecord = async (req, res) => {
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
  } = req.body;

  Product.update(
    {
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
      supplierId: supplierId,
    },
    {
      where: {
        id: id,
      },
    }
  )
    .then((product) => {
      res.status(statusErrors.success).json({
        results: {
          list: product,
          pagination: [],
        },
        success: true,
        error: "",
        message: "Cập nhật sản phẩm thành công!",
      });
    })
    .catch((err) => {
      res.status(statusErrors.badRequest).json({
        success: false,
        error: err.message,
        message: "Xảy ra lỗi khi cập nhật sản phẩm!",
      });
    });
};

const updateStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  Product.update(
    { status: status },
    {
      where: {
        id: id,
      },
    }
  )
    .then((product) => {
      res.status(statusErrors.success).json({
        results: {
          list: product,
          pagination: [],
        },
        success: true,
        error: "",
        message: "Cập nhật trạng thái thành công!",
      });
    })
    .catch((err) => {
      res.status(statusErrors.badRequest).json({
        success: false,
        error: err.message,
        message: "Xảy ra lỗi khi cập nhật trạng thái",
      });
    });
};

const deleteRecord = async (req, res) => {
  const { id } = req.params;
  Product.destroy({
    where: {
      id: id,
    },
  })
    .then((product) => {
      res.status(statusErrors.success).json({
        results: {
          list: product,
          pagination: [],
        },
        success: true,
        error: "",
        message: "Xóa sản phẩm thành công!",
      });
    })
    .catch((err) => {
      res.status(statusErrors.badRequest).json({
        success: false,
        message: err.message,
        message: "Xảy ra lôi khi xóa sản phẩm!",
      });
    });
};

const getAllProducerProduct = async (req, res) => {
  const { filter } = req.query;
  const filters = JSON.parse(filter || "{}");
  const websiteId = Number(filters?.websiteId) || 0;
  const categoryId = Number(filters?.categoryId) || 0;

  const producers = await Sequelize.query(
    `SELECT DISTINCT PR.id, PR.name
    FROM products as P
    JOIN producers as PR on P."producerId" = PR.id
    JOIN categories as C on P."categoryId" = C.id
    WHERE P."websiteId" = :websiteId
    AND (C."id" = :categoryId OR C."parent" = :categoryId)
    `,
    {
      replacements: {
        websiteId: websiteId,
        categoryId: categoryId,
      },
      type: QueryTypes.SELECT,
    }
  );

  res.status(200).json({
    results: {
      list: producers,
    },
    success: true,
    error: "",
    message: "",
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
  getAllProducerProduct,
};
