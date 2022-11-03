// THIRD IMPORT
const moment = require("moment");

// PROJECT IMPORT
const db = require("../models");
const Message = db.message;
const Website = db.website;
const Op = db.Sequelize.Op;
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
        "phone",
        "email",
        "websiteId",
        "message",
        "status",
        "createdAt",
        "updatedAt",
      ];
  const status = filters.status !== undefined ? filters?.status : "";
  const name = filters.name || "";
  const phone = filters.phone || "";
  const email = filters.email || "";
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
        { email: { [Op.like]: "%" + email + "%" } },
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
    ],
  };

  Message.findAndCountAll(options)
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
  Message.findOne({
    where: {
      id: id,
    },
  })
    .then((message) => {
      res.status(statusErrors.success).json({
        results: {
          list: message,
          pagination: [],
        },
        success: true,
        error: "",
        message: "",
      });
    })
    .catch((err) => {
      res.status(statusErrors.badRequest).json({
        success: falsex,
        error: err.message,
        message: "Xảy ra lỗi khi lấy thông tin liên hệ!",
      });
    });
};

const create = async (req, res) => {
  const data = req.body;

  Message.create({
    ...data,
  })
    .then((message) => {
      res.status(statusErrors.success).json({
        results: {
          list: message,
          pagination: [],
        },
        success: true,
        error: "",
        message: "Tạo mới liên hệ thành công!",
      });
    })
    .catch((err) => {
      res.status(statusErrors.badRequest).json({
        success: false,
        error: err.message,
        message: "Xảy ra lỗi khi tạo mới liên hệ!",
      });
    });
};

const updateRecord = async (req, res) => {
  const { id } = req.params;
  const { name, phone, email, message, websiteId, status } = req.body;

  Message.update(
    {
      status: status,
      name: name,
      phone: phone,
      email: email,
      message: message,
      websiteId: websiteId,
    },
    {
      where: {
        id: id,
      },
    }
  )
    .then((message) => {
      res.status(statusErrors.success).json({
        results: {
          list: message,
          pagination: [],
        },
        success: true,
        error: "",
        message: "Cập nhật liên hệ thành công!",
      });
    })
    .catch((err) => {
      res.status(statusErrors.badRequest).json({
        success: false,
        error: err.message,
        message: "Xảy ra lỗi khi cập nhật liên hệ!",
      });
    });
};

const updateStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  Message.update(
    { status: status },
    {
      where: {
        id: id,
      },
    }
  )
    .then((message) => {
      res.status(statusErrors.success).json({
        results: {
          list: message,
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
  Message.destroy({
    where: {
      id: id,
    },
  })
    .then((message) => {
      res.status(statusErrors.success).json({
        results: {
          list: message,
          pagination: [],
        },
        success: true,
        error: "",
        message: "Xóa liên hệ thành công!",
      });
    })
    .catch((err) => {
      res.status(statusErrors.badRequest).json({
        success: false,
        message: err.message,
        message: "Xảy ra lôi khi xóa liên hệ!",
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
