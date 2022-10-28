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
        "createdAt",
        "updatedAt",
      ];
  const status = filters.status || "";
  const name = filters.name || "";
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
        attributes: ["id", "text"],
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
    price,
    negotiablePrice,
    description,
    content,
    images,
    websiteId,
    categoryId,
    producerId,
    supplierId,
    status,
  } = req.body;

  Product.update(
    {
      status: status,
      name: name,
      price: price,
      negotiablePrice: negotiablePrice,
      description: description,
      content: content,
      images: images,
      websiteId: websiteId,
      categoryId: categoryId,
      producerId: producerId,
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

module.exports = {
  getList,
  getOne,
  create,
  updateRecord,
  updateStatus,
  deleteRecord,
};
