// THIRD IMPORT
const moment = require("moment");

// PROJECT IMPORT
const db = require("../models");
const Producer = db.producer;
const ProducerGroup = db.producerGroup;
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
        "description",
        "producerGroupId",
        "status",
        "createdAt",
        "updatedAt",
      ];
  const status = filters.status !== undefined ? filters?.status : "";
  const name = filters.name || "";
  const producerGroupId = filters.producerGroupId || "";
  const fromDate = filters.fromDate || "2021-01-01T14:06:48.000Z";
  const toDate = filters.toDate || moment();
  const size = ranges[1] - ranges[0];
  const current = Math.floor(ranges[1] / size);

  var options = {
    where: {
      [Op.and]: [
        status !== "" && { status: status },
        { name: { [Op.like]: "%" + name + "%" } },
        producerGroupId !== "" && { producerGroupId: producerGroupId },
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
        model: ProducerGroup,
        required: true,
        attributes: ["id", "name"],
      },
    ],
  };

  Producer.findAndCountAll(options)
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
  Producer.findOne({
    where: {
      id: id,
    },
  })
    .then((producer) => {
      res.status(statusErrors.success).json({
        results: {
          list: producer,
        },
        success: true,
      });
    })
    .catch((err) => {
      res.status(statusErrors.badRequest).json({
        success: false,
        error: err.message,
        message: "Xảy ra lỗi khi lấy thông tin nhà sản xuất!",
      });
    });
};

const create = async (req, res) => {
  const data = req.body;

  Producer.create({
    ...data,
  })
    .then((producer) => {
      res.status(statusErrors.success).json({
        results: {
          list: producer,
        },
        success: true,
        message: "Tạo mới nhà sản xuất thành công!",
      });
    })
    .catch((err) => {
      res.status(statusErrors.badRequest).json({
        success: false,
        error: err.message,
        message: "Xảy ra lỗi khi tạo mới nhà sản xuất!",
      });
    });
};

const updateRecord = async (req, res) => {
  const { id } = req.params;
  const { name, description, producerGroupId, status } = req.body;

  Producer.update(
    {
      status: status,
      name: name,
      description: description,
      producerGroupId: producerGroupId,
    },
    {
      where: {
        id: id,
      },
    }
  )
    .then((producer) => {
      res.status(statusErrors.success).json({
        results: {
          list: producer,
        },
        success: true,
        message: "Cập nhật nhà sản xuất thành công!",
      });
    })
    .catch((err) => {
      res.status(statusErrors.badRequest).json({
        success: false,
        error: err.message,
        message: "Xảy ra lỗi khi cập nhật nhà sản xuất!",
      });
    });
};

const updateStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  Producer.update(
    { status: status },
    {
      where: {
        id: id,
      },
    }
  )
    .then((producer) => {
      res.status(statusErrors.success).json({
        results: {
          list: producer,
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
  Producer.destroy({
    where: {
      id: id,
    },
  })
    .then((producer) => {
      res.status(statusErrors.success).json({
        results: {
          list: producer,
        },
        success: true,
        message: "Xóa nhà sản xuất thành công!",
      });
    })
    .catch((err) => {
      res.status(statusErrors.badRequest).json({
        success: false,
        error: err.message,
        message: "Xảy ra lôi khi xóa nhà sản xuất!",
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
