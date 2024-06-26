const doctor = require("./../Model/DoctorModel");
const User = require("./../Model/UserModel");
const APIFeatures = require("./../utils/apiFeatures");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");

const Doctor = require("./../Model/DoctorModel");

exports.getAllDoctor = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(
    doctor.find().select("-opningTime").populate("clinic"),
    req.query
  )

    .filter()
    .sort()
    .limitFields()
    .paginate();
  const doctors = await features.query;

  res.status(200).json({
    status: "success",
    results: doctors.length,
    data: {
      doctors,
    },
  });
});

exports.getAllDoctorDataa = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(
    doctor.find().select("-opningTime").populate({
      path: "clinic",
      select: "NameOfClinic LocationOfclinic  location -doctor    ",
    }),
    req.query
  )

    .filter()
    .sort()
    .limitFields()
    .paginate();
  const doctors = await features.query;

  res.status(200).json({
    status: "success",
    results: doctors.length,
    data: {
      doctors,
    },
  });
});

exports.getAllDoctorData = catchAsync(async (req, res, next) => {
  const typeofrole = req.role;
  const Id = req.userId;
  let query;

  if (typeofrole === "user") {
    query = doctor.find({ ClientUser: Id });
  } else if (typeofrole === "doctor") {
    query = doctor.find({ DoctorUser: Id });
  } else {
    return next(new AppError("Invalid role type", 400));
  }

  const features = new APIFeatures(
    query
      .select("-opningTime")
      .populate({
        path: "clinic",
        select: "NameOfClinic LocationOfclinic   -doctor    ",
      })
      .populate({
        path: "DoctorUser",
        model: User,
        select: "name",
      })
      .populate({
        path: "ClientUser",
        model: User,
      }),
    req.query
  );

  const doctors = await features.query;

  res.status(200).json({
    status: "success",
    results: doctors.length,
    data: {
      doctors,
      typeofrole,
      Id,
    },
  });
});
exports.getallDoctordata = catchAsync(async (req, res, next) => {
  const Doctor = await doctor
    .findById(req.params.id)
    .select("-opningTime")
    .populate({
      path: "clinic",
      select: "NameOfClinic LocationOfclinic   -doctor    ",
    })
    .populate({
      path: "DoctorUser",
      model: User,
      select: "name",
    })
    .populate({
      path: "ClientUser",
      model: User,
    });
  if (!Doctor) {
    return next(new AppError("No Doctor found with this ID", 404));
  }
  res.status(200).json({
    status: "success",
    results: Doctor.length,
    data: {
      Doctor,
    },
  });
});
exports.getDoctor = catchAsync(async (req, res, next) => {
  const Doctor = await doctor
    .findById(req.params.id)
    .populate("clinic")
    .select("-opningTime._id");
  if (!Doctor) {
    return next(new AppError("No Doctor found with this ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      Doctor,
    },
  });
});

exports.updateDoctorData = catchAsync(async (req, res, next) => {
  global.io.emit("eventname", "hi");
  const userid = req.userId;
  console.log(userid);
  const { doctorId } = req.params;
  const doctor = await Doctor.findByIdAndUpdate(
    doctorId,
    { $addToSet: { ClientUser: userid } },
    {
      new: true,
      runValidators: true,
    },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!doctor) {
    return next(new AppError("No tour found with that ID", 404));
  }
  const updatedUser = await User.findByIdAndUpdate(
    userid,
    { RevircedTime: req.body.RevircedTime },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!updatedUser) {
    return next(new AppError("No other object found with that ID", 404));
  }
  res.status(200).json({
    status: "success",
    data: {
      doctor,
      user: updatedUser,
    },
  });
});

exports.RevircedTime = catchAsync(async (req, res, next) => {
  const DataId = req.query.DataId;
  let query;

  query = doctor.find({ _id: DataId });

  const features = new APIFeatures(
    query
      .select("-opningTime")
      .populate({
        path: "clinic",
        select: "NameOfClinic LocationOfclinic   -doctor    ",
      })
      .populate({
        path: "DoctorUser",
        model: User,
        select: "name",
      })
      .populate({
        path: "ClientUser",
        select: "RevircedTime   -_id  ",
        model: User,
      }),
    req.query
  );

  const doctors = await features.query;

  const receivedTimes = doctors.map((doctor) => doctor.ClientUser);
  console.log(receivedTimes);
  res.status(200).json({
    status: "success",
    results: doctors.length,
    data: {
      receivedTimes,
    },
  });
});
