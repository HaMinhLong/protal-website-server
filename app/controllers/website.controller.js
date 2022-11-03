// THIRD IMPORT
const moment = require("moment");

// PROJECT IMPORT
const db = require("../models");
const Website = db.website;
const WebsiteGroup = db.websiteGroup;
const Op = db.Sequelize.Op;
const statusErrors = require("../errors/status-error");
var fs = require("fs");

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
        "logo",
        "websiteGroupId",
        "status",
        "createdAt",
        "updatedAt",
      ];
  const status = filters.status !== undefined ? filters?.status : "";
  const name = filters.name || "";
  const websiteGroupId = filters.websiteGroupId || "";
  const fromDate = filters.fromDate || "2021-01-01T14:06:48.000Z";
  const toDate = filters.toDate || moment();
  const size = ranges[1] - ranges[0];
  const current = Math.floor(ranges[1] / size);

  var options = {
    where: {
      [Op.and]: [
        status !== "" && { status: status },
        websiteGroupId !== "" && { websiteGroupId: websiteGroupId },
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
    include: [
      {
        model: WebsiteGroup,
        required: true,
        attributes: ["id", "name"],
      },
    ],
  };

  Website.findAndCountAll(options)
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
  Website.findOne({
    where: {
      id: id,
    },
  })
    .then((website) => {
      res.status(statusErrors.success).json({
        results: {
          list: website,
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
        message: "Xảy ra lỗi khi lấy thông tin website!",
      });
    });
};

const create = async (req, res) => {
  const data = req.body;

  const website = await Website.findOne({
    where: { name: data.name },
  });

  if (website) {
    res.status(statusErrors.badRequest).json({
      success: false,
      error: "Website đã tồn tại!",
      message: "Website đã tồn tại!",
    });
  } else {
    Website.create({
      ...data,
      logo: req.file ? "/uploads/" + req.file.filename : "",
    })
      .then((website) => {
        res.status(statusErrors.success).json({
          results: {
            list: website,
            pagination: [],
          },
          success: true,
          error: "",
          message: "Tạo mới website thành công!",
        });
      })
      .catch((err) => {
        res.status(statusErrors.badRequest).json({
          success: false,
          error: err.message,
          message: "Xảy ra lỗi khi tạo mới website!",
        });
      });
  }
};

const updateRecord = async (req, res) => {
  const { id } = req.params;
  const { name, description, websiteGroupId, status, logo, nameOld } = req.body;

  const website = await Website.findOne({
    where: { name: name },
  });

  if (website && name !== nameOld) {
    res.status(statusErrors.badRequest).json({
      success: false,
      error: "Website đã tồn tại!",
      message: "Website đã tồn tại!",
    });
  } else {
    if (req.file) {
      if (fs.existsSync(website.logo)) {
        //file exists
        fs.unlinkSync(__basedir + "/public/" + website.logo);
      }
    }
    Website.update(
      {
        status: status,
        name: name,
        description: description,
        websiteGroupId: websiteGroupId,
        logo: req.file ? "/uploads/" + req.file.filename : logo,
      },
      {
        where: {
          id: id,
        },
      }
    )
      .then((website) => {
        res.status(statusErrors.success).json({
          results: {
            list: website,
            pagination: [],
          },
          success: true,
          error: "",
          message: "Cập nhật website thành công!",
        });
      })
      .catch((err) => {
        res.status(statusErrors.badRequest).json({
          success: false,
          error: err.message,
          message: "Xảy ra lỗi khi cập nhật website!",
        });
      });
  }
};

const updateStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  Website.update(
    { status: status },
    {
      where: {
        id: id,
      },
    }
  )
    .then((website) => {
      res.status(statusErrors.success).json({
        results: {
          list: website,
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
  Website.destroy({
    where: {
      id: id,
    },
  })
    .then((website) => {
      res.status(statusErrors.success).json({
        results: {
          list: website,
          pagination: [],
        },
        success: true,
        error: "",
        message: "Xóa website thành công!",
      });
    })
    .catch((err) => {
      res.status(statusErrors.badRequest).json({
        success: false,
        message: err.message,
        message: "Xảy ra lôi khi xóa website!",
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
