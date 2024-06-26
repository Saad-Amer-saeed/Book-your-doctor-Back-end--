const AppError = require("./../utils/appError");


const sendErrorDev = (err, res) => {
  console.log(err.message);
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });


  } else {
    // 1) Log error
    console.error("ERROR 💥", err);

    // 2) Send generic message
    res.status(500).json({
      status: "error",
      message: "Something went very wrong!",
    });
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === "production") {
    const { CastError } = require("mongoose");

    // let error = { ...err };
    // if (err instanceof CastError) error = handleCastErrorDB(error);

    // if (error.code === 11000) error = handleDuplicateFieldsDB(error);

    // if (err.name === "ValidationError") error = handleValidationErrorDB(error);

    sendErrorProd(err, res);
  }
};
