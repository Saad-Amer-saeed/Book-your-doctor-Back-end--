const mongoose = require("mongoose");

const ClincSchema = new mongoose.Schema(
  {
    NameOfClinic: {
      type: String,
      required: [true, "A Clinc must have a name"],
      // unique: true,
      trim: true,
    },
    TypeOfclinic: {
      type: String,
      required: [true, "A Clinc must have a Type"],
    },
    NumOfDoctor: {
      type: Number,
      required: [true, "A Clinc must have a Num-of-Doctor "],
    },
    LocationOfclinic: {
      type: String,
      required: [true, "A Clinc must have a Location"],
    },
    location: { type: [Number], required: true },

    doctor: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "doctor",
        required: [true, "A Clinic SHOULD BE HERE"],
      },
    ],
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

ClincSchema.pre(/^find/, function (next) {
  this.populate({
    path: "doctor",
    select: "-__v  -opningTime  ",
  });
  next();
});

const Clinic = mongoose.model("clinic", ClincSchema);

module.exports = Clinic;
