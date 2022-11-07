// THIRD IMPORT
const moment = require("moment");

// PROJECT IMPORT
const db = require("../models");
const WebsiteGroup = db.websiteGroup;
const Op = db.Sequelize.Op;
const statusErrors = require("../errors/status-error");

const getList = async (req, res) => {
  const { filter, range, sort, attributes } = req.query;
  const filters = filter ? JSON.parse(filter) : {};
  const ranges = range ? JSON.parse(range) : [0, 20];
  const order = sort ? JSON.parse(sort) : ["createdAt", "DESC"];
  const attributesQuery = attributes
    ? attributes.split(",")
    : ["id", "name", "description", "status", "createdAt", "updatedAt"];
  const status = filters.status !== undefined ? filters?.status : "";
  const name = filters.name || "";
  const fromDate = filters.fromDate || "2021-01-01T14:06:48.000Z";
  const toDate = filters.toDate || moment();
  const size = ranges[1] - ranges[0];
  const current = Math.floor(ranges[1] / size);

  var options = {
    where: {
      [Op.and]: [
        status !== "" && { status: status },
        { name: { [Op.like]: "%" + name + "%" } },
      ],
      createdAt: {
        [Op.between]: [fromDate, toDate],
      },
    },
    order: [order],
    attributes: attributesQuery,
    offset: ranges[0],
    limit: size,
  };

  WebsiteGroup.findAndCountAll(options)
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
  WebsiteGroup.findOne({
    where: {
      id: id,
    },
  })
    .then((websiteGroup) => {
      res.status(statusErrors.success).json({
        results: {
          list: websiteGroup,
        },
        success: true,
      });
    })
    .catch((err) => {
      res.status(statusErrors.badRequest).json({
        success: false,
        error: err.message,
        message: "Xảy ra lỗi khi lấy thông tin nhóm website!",
      });
    });
};

const create = async (req, res) => {
  const data = req.body;

  WebsiteGroup.create({
    ...data,
  })
    .then((websiteGroup) => {
      res.status(statusErrors.success).json({
        results: {
          list: websiteGroup,
        },
        success: true,
        message: "Tạo mới nhóm website thành công!",
      });
    })
    .catch((err) => {
      res.status(statusErrors.badRequest).json({
        success: false,
        error: err.message,
        message: "Xảy ra lỗi khi tạo mới nhóm website!",
      });
    });
};

const updateRecord = async (req, res) => {
  const { id } = req.params;
  const { name, description, status } = req.body;

  WebsiteGroup.update(
    {
      status: status,
      name: name,
      description: description,
    },
    {
      where: {
        id: id,
      },
    }
  )
    .then((websiteGroup) => {
      res.status(statusErrors.success).json({
        results: {
          list: websiteGroup,
        },
        success: true,
        message: "Cập nhật nhóm website thành công!",
      });
    })
    .catch((err) => {
      res.status(statusErrors.badRequest).json({
        success: false,
        error: err.message,
        message: "Xảy ra lỗi khi cập nhật nhóm website!",
      });
    });
};

const updateStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  WebsiteGroup.update(
    { status: status },
    {
      where: {
        id: id,
      },
    }
  )
    .then((websiteGroup) => {
      res.status(statusErrors.success).json({
        results: {
          list: websiteGroup,
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
  WebsiteGroup.destroy({
    where: {
      id: id,
    },
  })
    .then((websiteGroup) => {
      res.status(statusErrors.success).json({
        results: {
          list: websiteGroup,
        },
        success: true,
        message: "Xóa nhóm website thành công!",
      });
    })
    .catch((err) => {
      res.status(statusErrors.badRequest).json({
        success: false,
        error: err.message,
        message: "Xảy ra lôi khi xóa nhóm website!",
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
