// THIRD IMPORT
const moment = require("moment");

// PROJECT IMPORT
const db = require("../models");
const Location = db.location;
const Op = db.Sequelize.Op;
const Website = db.website;
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
        "mobile",
        "email",
        "bankName",
        "address",
        "location",
        "websiteId",
        "status",
      ];
  const status = filters.status !== undefined ? filters?.status : "";
  const name = filters.name || "";
  const websiteId = filters.websiteId || "";
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

  Location.findAndCountAll(options)
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
  Location.findOne({
    where: {
      id: id,
    },
    include: [
      {
        model: Website,
        required: true,
        attributes: ["id", "name"],
      },
    ],
  })
    .then((location) => {
      res.status(statusErrors.success).json({
        results: {
          list: location,
        },
        success: true,
      });
    })
    .catch((err) => {
      res.status(statusErrors.badRequest).json({
        success: false,
        error: err.message,
        message: "Xảy ra lỗi khi lấy thông tin địa điểm!",
      });
    });
};

const create = async (req, res) => {
  const data = req.body;

  Location.create({
    ...data,
  })
    .then((location) => {
      res.status(statusErrors.success).json({
        results: {
          list: location,
        },
        success: true,
        message: "Tạo mới địa điểm thành công!",
      });
    })
    .catch((err) => {
      res.status(statusErrors.badRequest).json({
        success: false,
        error: err.message,
        message: "Xảy ra lỗi khi tạo mới địa điểm!",
      });
    });
};

const updateRecord = async (req, res) => {
  const { id } = req.params;
  const {
    name,
    mobile,
    email,
    bankName,
    address,
    location,
    websiteId,
    status,
  } = req.body;

  Location.update(
    {
      status: status,
      name: name,
      mobile: mobile,
      email: email,
      bankName: bankName,
      address: address,
      location: location,
      websiteId: websiteId,
    },
    {
      where: {
        id: id,
      },
    }
  )
    .then((location) => {
      res.status(statusErrors.success).json({
        results: {
          list: location,
        },
        success: true,
        message: "Cập nhật địa điểm thành công!",
      });
    })
    .catch((err) => {
      res.status(statusErrors.badRequest).json({
        success: false,
        error: err.message,
        message: "Xảy ra lỗi khi cập nhật địa điểm!",
      });
    });
};

const updateStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  Location.update(
    { status: status },
    {
      where: {
        id: id,
      },
    }
  )
    .then((location) => {
      res.status(statusErrors.success).json({
        results: {
          list: location,
        },
        success: true,
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
  Location.destroy({
    where: {
      id: id,
    },
  })
    .then((location) => {
      res.status(statusErrors.success).json({
        results: {
          list: location,
        },
        success: true,
        message: "Xóa địa điểm thành công!",
      });
    })
    .catch((err) => {
      res.status(statusErrors.badRequest).json({
        success: false,
        error: err.message,
        message: "Xảy ra lôi khi xóa địa điểm!",
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
