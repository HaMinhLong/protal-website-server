// THIRD IMPORT
const moment = require("moment");

// PROJECT IMPORT
const db = require("../models");
const Collection = db.collection;
const Op = db.Sequelize.Op;
const CollectionProduct = db.collectionProduct;
const Product = db.product;
const Category = db.category;
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
        "description",
        "websiteId",
        "categoryId",
        "status",
        "createdAt",
        "updatedAt",
      ];
  const status = filters.status !== undefined ? filters?.status : "";
  const name = filters.name || "";
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
        { name: { [Op.like]: "%" + name + "%" } },
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

  Collection.findAndCountAll(options)
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
  Collection.findOne({
    where: {
      id: id,
    },
    include: [
      {
        model: Category,
        required: true,
        attributes: ["id", "text"],
      },
      {
        model: Product,
        required: true,
        attributes: ["id", "name", "price", "negotiablePrice", "images"],
      },
    ],
  })
    .then((collection) => {
      res.status(statusErrors.success).json({
        results: {
          list: collection,
        },
        success: true,
      });
    })
    .catch((err) => {
      res.status(statusErrors.badRequest).json({
        success: false,
        error: err.message,
        message: "Xảy ra lỗi khi lấy thông tin bộ danh sách!",
      });
    });
};

const getOneByUrl = async (req, res) => {
  const { url } = req.params;
  Collection.findOne({
    include: [
      {
        model: Category,
        required: true,
        attributes: ["id", "text", "url"],
        where: {
          url: `/${url}`,
        },
      },
      {
        model: Product,
        required: true,
        attributes: [
          "id",
          "name",
          "price",
          "isSale",
          "negotiablePrice",
          "images",
          "url",
        ],
      },
    ],
  })
    .then((menu) => {
      res.status(statusErrors.success).json({
        results: {
          list: menu,
        },
        success: true,
      });
    })
    .catch((err) => {
      res.status(statusErrors.badRequest).json({
        success: false,
        error: err.message,
        message: "Xảy ra lỗi khi lấy thông tin bộ danh sách!",
      });
    });
};

const create = async (req, res) => {
  const data = req.body;

  Collection.create({
    ...data,
  })
    .then((collection) => {
      const collectionProductsAdd = data.collectionProducts?.filter(
        (item) => item.flag === "add"
      );

      console.log("collectionProductsAdd", collectionProductsAdd);

      CollectionProduct.bulkCreate(
        collectionProductsAdd?.map((item) => {
          return { productId: item?.productId, collectionId: collection?.id };
        })
      );

      res.status(statusErrors.success).json({
        results: {
          list: collection,
        },
        success: true,
        message: "Tạo mới bộ danh sách thành công!",
      });
    })
    .catch((err) => {
      res.status(statusErrors.badRequest).json({
        success: false,
        error: err.message,
        message: "Xảy ra lỗi khi tạo mới bộ danh sách!",
      });
    });
};

const updateRecord = async (req, res) => {
  const { id } = req.params;
  const {
    name,
    description,
    websiteId,
    categoryId,
    status,
    collectionProducts,
  } = req.body;

  Collection.update(
    {
      status: status,
      name: name,
      description: description,
      websiteId: websiteId,
      categoryId: categoryId,
    },
    {
      where: {
        id: id,
      },
    }
  )
    .then((collection) => {
      const collectionProductsAdd = collectionProducts?.filter(
        (item) => item.flag === "add"
      );

      CollectionProduct.bulkCreate(
        collectionProductsAdd?.map((item) => {
          return { productId: item?.productId, collectionId: id };
        })
      );

      const collectionProductsDelete = collectionProducts?.map((item) => {
        if (item.flag === "delete") return item?.productId;
      });
      CollectionProduct.destroy({
        where: {
          productId: { [Op.in]: collectionProductsDelete },
        },
      });

      res.status(statusErrors.success).json({
        results: {
          list: collection,
        },
        success: true,
        message: "Cập nhật bộ danh sách thành công!",
      });
    })
    .catch((err) => {
      res.status(statusErrors.badRequest).json({
        success: false,
        error: err.message,
        message: "Xảy ra lỗi khi cập nhật bộ danh sách!",
      });
    });
};

const updateStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  Collection.update(
    { status: status },
    {
      where: {
        id: id,
      },
    }
  )
    .then((collection) => {
      res.status(statusErrors.success).json({
        results: {
          list: collection,
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
  Collection.destroy({
    where: {
      id: id,
    },
  })
    .then((collection) => {
      CollectionProduct.destroy({
        where: {
          collectionId: id,
        },
      });
      res.status(statusErrors.success).json({
        results: {
          list: collection,
        },
        success: true,
        message: "Xóa bộ danh sách thành công!",
      });
    })
    .catch((err) => {
      res.status(statusErrors.badRequest).json({
        success: false,
        error: err.message,
        message: "Xảy ra lôi khi xóa bộ danh sách!",
      });
    });
};

module.exports = {
  getList,
  getOne,
  getOneByUrl,
  create,
  updateRecord,
  updateStatus,
  deleteRecord,
};
