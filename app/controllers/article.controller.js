// THIRD IMPORT
const moment = require("moment");

// PROJECT IMPORT
const db = require("../models");
const Article = db.article;
const Website = db.website;
const Category = db.category;
const Op = db.Sequelize.Op;
const statusErrors = require("../errors/status-error");

const getList = async (req, res) => {
  const { filter, range, sort, attributes } = req.query;
  const filters = filter ? JSON.parse(filter) : {};
  const ranges = range ? JSON.parse(range) : [0, 20];
  const order = sort ? JSON.parse(sort) : ["createdAt", "DESC"];
  console.log("order", order);
  const attributesQuery = attributes
    ? attributes.split(",")
    : [
        "id",
        "title",
        "description",
        "content",
        "url",
        "author",
        "source",
        "label",
        "images",
        "websiteId",
        "categoryId",
        "status",
        "createdAt",
        "updatedAt",
      ];
  const status = filters.status || "";
  const title = filters.title || "";
  const websiteId = filters.websiteId || "";
  const categoryId = filters.categoryId || "";
  const fromDate = filters.fromDate || "2021-01-01T14:06:48.000Z";
  const toDate = filters.toDate || moment();
  const size = ranges[1] - ranges[0];
  const current = Math.floor(ranges[1] / size);

  var options = {
    where: {
      [Op.and]: [
        status !== "" && { status: status },
        { title: { [Op.like]: "%" + title + "%" } },
        websiteId !== "" && { websiteId: websiteId },
        categoryId !== "" && { categoryId: categoryId },
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
    ],
  };

  Article.findAndCountAll(options)
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
  Article.findOne({
    where: {
      id: id,
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
        message: "Xảy ra lỗi khi lấy thông tin tin tức!",
      });
    });
};

const create = async (req, res) => {
  const data = req.body;

  Article.create({
    ...data,
  })
    .then((menu) => {
      res.status(statusErrors.success).json({
        results: {
          list: menu,
          pagination: [],
        },
        success: true,
        error: "",
        message: "Tạo mới tin tức thành công!",
      });
    })
    .catch((err) => {
      res.status(statusErrors.badRequest).json({
        success: false,
        error: err.message,
        message: "Xảy ra lỗi khi tạo mới tin tức!",
      });
    });
};

const updateRecord = async (req, res) => {
  const { id } = req.params;
  const {
    title,
    description,
    content,
    url,
    author,
    source,
    label,
    images,
    websiteId,
    categoryId,
    status,
  } = req.body;

  Article.update(
    {
      title: title,
      description: description,
      content: content,
      url: url,
      author: author,
      source: source,
      label: label,
      images: images,
      websiteId: websiteId,
      categoryId: categoryId,
      status: status,
    },
    {
      where: {
        id: id,
      },
    }
  )
    .then((menu) => {
      res.status(statusErrors.success).json({
        results: {
          list: menu,
          pagination: [],
        },
        success: true,
        error: "",
        message: "Cập nhật tin tức thành công!",
      });
    })
    .catch((err) => {
      res.status(statusErrors.badRequest).json({
        success: false,
        error: err.message,
        message: "Xảy ra lỗi khi cập nhật tin tức!",
      });
    });
};

const updateStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  Article.update(
    { status: status },
    {
      where: {
        id: id,
      },
    }
  )
    .then((menu) => {
      res.status(statusErrors.success).json({
        results: {
          list: menu,
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
  Article.destroy({
    where: {
      id: id,
    },
  })
    .then((menu) => {
      res.status(statusErrors.success).json({
        results: {
          list: menu,
          pagination: [],
        },
        success: true,
        error: "",
        message: "Xóa tin tức thành công!",
      });
    })
    .catch((err) => {
      res.status(statusErrors.badRequest).json({
        success: false,
        message: err.message,
        message: "Xảy ra lôi khi xóa tin tức!",
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
