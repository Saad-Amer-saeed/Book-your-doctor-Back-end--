const express = require("express");
// const morgan = require("morgan");
const ClinicRouter = require("./routes/ClinicRoutes");
const DoctorRouter = require("./routes/DoctorRoutes");
const userRouter = require("./routes/userRoutes");

// const passRoutes = require("./routes/passRoutes");
const globalErrorHandel = require("./controllers/errorController");
const AppError = require("./utils/appError");

const app = express();

app.use(express.json());

// app.use(globalErrorHandel);
app.use("/api/v1/DoctorRouter", DoctorRouter);
app.use("/api/v1/ClinicRouter", ClinicRouter);
app.use("/api/v1/userRouter", userRouter);
app.all("*", (req, res, next) => {
  next(new AppError(`Cant't find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandel);
module.exports = app;
