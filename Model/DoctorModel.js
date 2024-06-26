const mongoose = require("mongoose");

const DoctorSchema = new mongoose.Schema(
  {
    NameOfDoctor: {
      type: String,
      required: [true, "This field required"],
      // unique: true,
      trim: true,
    },
    Spcilized: {
      type: String,
      required: [true, "This field required"],
    },
    certifcate: {
      type: String,
      required: [true, "This field required"],
    },
    DoctorUser: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: [true, "A Clinic SHOULD BE HERE"],
      },
    ],
    ClientUser: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: [true, "A Clinic SHOULD BE HERE"],
      },
    ],
    opningTime: [
      {
        day: { type: String, required: true },
        times: {
          open: { type: String, required: true },
          close: { type: String, required: true },
        },
      },
    ],
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

DoctorSchema.virtual("clinic", {
  ref: "clinic",
  foreignField: "doctor",
  localField: "_id",
});
const Doctor = mongoose.model("doctor", DoctorSchema);

module.exports = Doctor;
