// THIRD IMPORT
const moment = require("moment");

// PROJECT IMPORT
const db = require("../models");
const Order = db.order;
const Product = db.product;
const ProductOrder = db.productOrder;
const Website = db.website;
const PaymentMethod = db.paymentMethod;
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
        "address",
        "totalPrice",
        "description",
        "websiteId",
        "paymentMethodId",
        "status",
        "createdAt",
        "updatedAt",
      ];
  const status = filters.status !== undefined ? filters?.status : "";
  const name = filters.name || "";
  const phone = filters.phone || "";
  const email = filters.email || "";
  const websiteId = filters.websiteId || "";
  const paymentMethodId = filters.paymentMethodId || "";
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
        websiteId !== "" && { websiteId: websiteId },
        paymentMethodId !== "" && { paymentMethodId: paymentMethodId },
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
        model: PaymentMethod,
        required: true,
        attributes: ["id", "name"],
      },
    ],
  };

  Order.findAndCountAll(options)
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
  Order.findOne({
    where: {
      id: id,
    },
    include: [
      {
        model: Product,
        required: false,
        attributes: ["id", "name"],
      },
    ],
  })
    .then((order) => {
      res.status(statusErrors.success).json({
        results: {
          list: order,
        },
        success: true,
      });
    })
    .catch((err) => {
      res.status(statusErrors.badRequest).json({
        success: false,
        error: err.message,
        message: "Xảy ra lỗi khi lấy thông tin đơn hàng!",
      });
    });
};

const create = async (req, res) => {
  const data = req.body;

  Order.create({
    ...data,
  })
    .then((order) => {
      const productOrdersAdd = data.productOrders?.filter(
        (item) => item.flag === "add"
      );
      const productOrdersCreate = productOrdersAdd?.map((item) => {
        return {
          ...item,
          orderId: order.id,
        };
      });
      ProductOrder.bulkCreate(productOrdersCreate);

      res.status(statusErrors.success).json({
        results: {
          list: order,
        },
        success: true,
        message: "Tạo mới đơn hàng thành công!",
      });
    })
    .catch((err) => {
      res.status(statusErrors.badRequest).json({
        success: false,
        error: err.message,
        message: "Xảy ra lỗi khi tạo mới đơn hàng!",
      });
    });
};

const updateRecord = async (req, res) => {
  const { id } = req.params;
  const {
    name,
    phone,
    email,
    address,
    totalPrice,
    websiteId,
    paymentMethodId,
    description,
    status,
    productOrders,
  } = req.body;

  Order.update(
    {
      status: status,
      name: name,
      phone: phone,
      email: email,
      address: address,
      totalPrice: totalPrice,
      websiteId: websiteId,
      paymentMethodId: paymentMethodId,
      description: description,
    },
    {
      where: {
        id: id,
      },
    }
  )
    .then((order) => {
      const productOrdersAdd = productOrders?.filter(
        (item) => item.flag === "add"
      );
      const productOrdersCreate = productOrdersAdd?.map((item) => {
        return {
          ...item,
          orderId: order.id,
        };
      });
      ProductOrder.bulkCreate(productOrdersCreate);

      const productOrdersUpdate = productOrders?.filter(
        (item) => item.flag === "update"
      );
      productOrdersUpdate.forEach((element) => {
        ProductOrder.update(
          {
            amount: element.amount,
            price: element.price,
            negotiablePrice: element.negotiablePrice,
            totalPrice: element.totalPrice,
          },
          {
            where: {
              id: element.id,
            },
          }
        );
      });

      res.status(statusErrors.success).json({
        results: {
          list: order,
        },
        success: true,
        message: "Cập nhật đơn hàng thành công!",
      });
    })
    .catch((err) => {
      res.status(statusErrors.badRequest).json({
        success: false,
        error: err.message,
        message: "Xảy ra lỗi khi cập nhật đơn hàng!",
      });
    });
};

const updateStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  Order.update(
    { status: status },
    {
      where: {
        id: id,
      },
    }
  )
    .then((order) => {
      res.status(statusErrors.success).json({
        results: {
          list: order,
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
  Order.destroy({
    where: {
      id: id,
    },
  })
    .then((order) => {
      ProductOrder.destroy({
        where: {
          orderId: id,
        },
      });
      res.status(statusErrors.success).json({
        results: {
          list: order,
        },
        success: true,
        message: "Xóa đơn hàng thành công!",
      });
    })
    .catch((err) => {
      res.status(statusErrors.badRequest).json({
        success: false,
        error: err.message,
        message: "Xảy ra lôi khi xóa đơn hàng!",
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
