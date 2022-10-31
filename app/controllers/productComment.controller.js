// THIRD IMPORT
const moment = require("moment");

// PROJECT IMPORT
const db = require("../models");
const ProductComment = db.productComment;
const Op = db.Sequelize.Op;
const statusErrors = require("../errors/status-error");
const Website = db.website;
const Product = db.product;

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
        "rate",
        "phone",
        "websiteId",
        "productId",
        "comment",
        "status",
        "createdAt",
        "updatedAt",
      ];
  const status = filters.status !== undefined ? filters?.status : "";
  const rate = filters.rate || "";
  const name = filters.name || "";
  const phone = filters.phone || "";
  const websiteId = filters.websiteId || "";
  const productId = filters.productId || "";
  const fromDate = filters.fromDate || "2021-01-01T14:06:48.000Z";
  const toDate = filters.toDate || moment();
  const size = ranges[1] - ranges[0];
  const current = Math.floor(ranges[1] / size);

  var options = {
    where: {
      [Op.and]: [
        status !== "" && { status: status },
        { name: { [Op.like]: "%" + name + "%" } },
        { phone: { [Op.like]: "%" + phone + "%" } },
        websiteId !== "" && { websiteId: websiteId },
        rate !== "" && { rate: rate },
        productId !== "" && { productId: productId },
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
        model: Product,
        required: true,
        attributes: ["id", "name"],
      },
    ],
  };

  ProductComment.findAndCountAll(options)
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
  ProductComment.findOne({
    where: {
      id: id,
    },
  })
    .then((productComment) => {
      res.status(statusErrors.success).json({
        results: {
          list: productComment,
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
        message: "Xảy ra lỗi khi lấy thông tin bình luận sản phẩm!",
      });
    });
};

const create = async (req, res) => {
  const data = req.body;

  ProductComment.create({
    ...data,
  })
    .then((productComment) => {
      res.status(statusErrors.success).json({
        results: {
          list: productComment,
          pagination: [],
        },
        success: true,
        error: "",
        message: "Tạo mới bình luận sản phẩm thành công!",
      });
    })
    .catch((err) => {
      res.status(statusErrors.badRequest).json({
        success: false,
        error: err.message,
        message: "Xảy ra lỗi khi tạo mới bình luận sản phẩm!",
      });
    });
};

const updateRecord = async (req, res) => {
  const { id } = req.params;
  const { name, phone, rate, websiteId, productId, comment, status } = req.body;

  ProductComment.update(
    {
      status: status,
      name: name,
      phone: phone,
      rate: rate,
      websiteId: websiteId,
      productId: productId,
      comment: comment,
    },
    {
      where: {
        id: id,
      },
    }
  )
    .then((productComment) => {
      res.status(statusErrors.success).json({
        results: {
          list: productComment,
          pagination: [],
        },
        success: true,
        error: "",
        message: "Cập nhật bình luận sản phẩm thành công!",
      });
    })
    .catch((err) => {
      res.status(statusErrors.badRequest).json({
        success: false,
        error: err.message,
        message: "Xảy ra lỗi khi cập nhật bình luận sản phẩm!",
      });
    });
};

const updateStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  ProductComment.update(
    { status: status },
    {
      where: {
        id: id,
      },
    }
  )
    .then((productComment) => {
      res.status(statusErrors.success).json({
        results: {
          list: productComment,
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
  ProductComment.destroy({
    where: {
      id: id,
    },
  })
    .then((productComment) => {
      res.status(statusErrors.success).json({
        results: {
          list: productComment,
          pagination: [],
        },
        success: true,
        error: "",
        message: "Xóa bình luận sản phẩm thành công!",
      });
    })
    .catch((err) => {
      res.status(statusErrors.badRequest).json({
        success: false,
        message: err.message,
        message: "Xảy ra lôi khi xóa bình luận sản phẩm!",
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
