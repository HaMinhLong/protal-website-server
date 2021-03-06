// THIRD IMPORT
const moment = require("moment");

// PROJECT IMPORT
const db = require("../models");
const Menu = db.menu;
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
        "url",
        "orderBy",
        "position",
        "status",
        "parentId",
        "websiteId",
        "createdAt",
        "updatedAt",
      ];
  const status = filters.status || "";
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
    hierarchy: true,
  };

  Menu.findAndCountAll(options)
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
  Menu.findOne({
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
        message: "",
      });
    })
    .catch((err) => {
      res.status(statusErrors.badRequest).json({
        success: true,
        error: err.message,
        message: "Xảy ra lỗi khi lấy thông tin menu website!",
      });
    });
};

const create = async (req, res) => {
  const data = req.body;

  Menu.create({
    ...data,
    id:
      Math.floor(Math.random() * (100000000000 - 1000000000 + 1)) +
      100000000000,
  })
    .then((menu) => {
      res.status(statusErrors.success).json({
        results: {
          list: menu,
          pagination: [],
        },
        success: true,
        error: "",
        message: "Tạo mới menu website thành công!",
      });
    })
    .catch((err) => {
      res.status(statusErrors.badRequest).json({
        success: false,
        error: err.message,
        message: "Xảy ra lỗi khi tạo mới menu website!",
      });
    });
};

const updateRecord = async (req, res) => {
  const { id } = req.params;
  const { name, url, orderBy, position, parentId, websiteId, status } =
    req.body;

  Menu.update(
    {
      name: name,
      url: url,
      orderBy: orderBy,
      position: position,
      status: status,
      parentId: parentId,
      websiteId: websiteId,
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
        message: "Cập nhật menu website thành công!",
      });
    })
    .catch((err) => {
      res.status(statusErrors.badRequest).json({
        success: false,
        error: err.message,
        message: "Xảy ra lỗi khi cập nhật menu website!",
      });
    });
};

const updateStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  Menu.update(
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
  Menu.destroy({
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
        message: "Xóa menu website thành công!",
      });
    })
    .catch((err) => {
      res.status(statusErrors.badRequest).json({
        success: false,
        message: err.message,
        message: "Xảy ra lôi khi xóa menu website!",
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
