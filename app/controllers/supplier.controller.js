// THIRD IMPORT
const moment = require("moment");

// PROJECT IMPORT
const db = require("../models");
const Supplier = db.supplier;
const SupplierGroup = db.supplierGroup;
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
        "supplierGroupId",
        "status",
        "createdAt",
        "updatedAt",
      ];
  const status = filters.status !== undefined ? filters?.status : "";
  const name = filters.name || "";
  const supplierGroupId = filters.supplierGroupId || "";
  const fromDate = filters.fromDate || "2021-01-01T14:06:48.000Z";
  const toDate = filters.toDate || moment();
  const size = ranges[1] - ranges[0];
  const current = Math.floor(ranges[1] / size);

  var options = {
    where: {
      [Op.and]: [
        status !== "" && { status: status },
        { name: { [Op.like]: "%" + name + "%" } },
        supplierGroupId !== "" && { supplierGroupId: supplierGroupId },
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
        model: SupplierGroup,
        required: true,
        attributes: ["id", "name"],
      },
    ],
  };

  Supplier.findAndCountAll(options)
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
  Supplier.findOne({
    where: {
      id: id,
    },
  })
    .then((supplier) => {
      res.status(statusErrors.success).json({
        results: {
          list: supplier,
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
        message: "Xảy ra lỗi khi lấy thông tin nhà cung cấp!",
      });
    });
};

const create = async (req, res) => {
  const data = req.body;

  Supplier.create({
    ...data,
  })
    .then((supplier) => {
      res.status(statusErrors.success).json({
        results: {
          list: supplier,
          pagination: [],
        },
        success: true,
        error: "",
        message: "Tạo mới nhà cung cấp thành công!",
      });
    })
    .catch((err) => {
      res.status(statusErrors.badRequest).json({
        success: false,
        error: err.message,
        message: "Xảy ra lỗi khi tạo mới nhà cung cấp!",
      });
    });
};

const updateRecord = async (req, res) => {
  const { id } = req.params;
  const { name, description, supplierGroupId, status } = req.body;

  Supplier.update(
    {
      status: status,
      name: name,
      description: description,
      supplierGroupId: supplierGroupId,
    },
    {
      where: {
        id: id,
      },
    }
  )
    .then((supplier) => {
      res.status(statusErrors.success).json({
        results: {
          list: supplier,
          pagination: [],
        },
        success: true,
        error: "",
        message: "Cập nhật nhà cung cấp thành công!",
      });
    })
    .catch((err) => {
      res.status(statusErrors.badRequest).json({
        success: false,
        error: err.message,
        message: "Xảy ra lỗi khi cập nhật nhà cung cấp!",
      });
    });
};

const updateStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  Supplier.update(
    { status: status },
    {
      where: {
        id: id,
      },
    }
  )
    .then((supplier) => {
      res.status(statusErrors.success).json({
        results: {
          list: supplier,
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
  Supplier.destroy({
    where: {
      id: id,
    },
  })
    .then((supplier) => {
      res.status(statusErrors.success).json({
        results: {
          list: supplier,
          pagination: [],
        },
        success: true,
        error: "",
        message: "Xóa nhà cung cấp thành công!",
      });
    })
    .catch((err) => {
      res.status(statusErrors.badRequest).json({
        success: false,
        message: err.message,
        message: "Xảy ra lôi khi xóa nhà cung cấp!",
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
