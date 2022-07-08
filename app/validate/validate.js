const express = require("express");
const { validationResult } = require("express-validator");
const statusErrors = require("../errors/status-error");

// can be reused by many routes

// sequential processing, stops running validations chain if the previous one have failed.
const validate = (validations) => {
  return async (req, res, next) => {
    for (let validation of validations) {
      await validation.run(req);
    }

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    const errorsResponse = {};
    errors.array().map((item) => {
      errorsResponse[item.param] = item.msg;
    });

    res.status(statusErrors.badRequest).json({
      success: false,
      message: "Vui lòng nhập đúng dữ liệu!",
      error: errorsResponse,
    });
  };
};

module.exports = { validate };
