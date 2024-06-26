const clinic = require("./../Model/ClinicModel");
const APIFeatures = require("./../utils/apiFeatures");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const mongoose = require("mongoose");
const { ObjectId } = require("mongoose").Types;

const { query, json } = require("express");

exports.getAllClinic = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(
    clinic.find().populate({
      path: "doctor",
      select: "-__v -opningTime",
    }),
    req.query
  )
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const Clinic = await features.query;

  res.status(200).json({
    status: "success",
    results: Clinic.length,
    data: {
      Clinic,
    },
  });
});
exports.getAllClinicData = catchAsync(async (req, res, next) => {
  const Clinic = await clinic.aggregate([
    {
      $project: {
        NameOfClinic: "$NameOfClinic",
        TypeOfclinic: "$TypeOfclinic",
        LocationOfclinic: "$LocationOfclinic",
        location: "$location",
        item: 3,
        NumerOfDoctor: {
          $cond: {
            if: { $isArray: "$doctor" },
            then: { $size: "$doctor" },
            else: "NA",
          },
        },
      },
    },
  ]);
  res.status(200).json({
    status: "success",
    results: Clinic.length,
    data: {
      Clinic,
    },
  });
});

exports.getAllDoctor = catchAsync(async (req, res, next) => {
  const Clinic = await clinic.aggregate([
    {
      $project: {
        NameOfClinic: 1,
        TypeOfclinic: 1,
        LocationOfclinic: 1,
        doctor: 1,
      },
    },
  ]);
  const DoctorsData = await clinic.populate(Clinic, {
    path: "doctor",
    select: "-__v -opningTime",
  });

  res.status(200).json({
    status: "success",
    results: DoctorsData.length,
    data: {
      DoctorsData,
    },
  });
});

exports.ClinicsDoctor = catchAsync(async (req, res, next) => {
  const Clinic = await clinic.findById(req.params.id).select(" -NumOfDoctor");
  if (!Clinic) {
    return next(new AppError("No tour found with this ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      Clinic,
    },
  });
});
