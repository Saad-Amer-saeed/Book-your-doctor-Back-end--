const express = require("express");
const DoctorController = require("./../controllers/DoctorController");
const authController = require("./../controllers/authController");

const router = express.Router();

router.route("/").get(DoctorController.getAllDoctor);
router
  .route("/getAllDoctorDataReviced")
  .get(authController.protect, DoctorController.getAllDoctorData);
router
  .route("/RevircedTime")
  .get(authController.protect, DoctorController.RevircedTime);
router.route("/getAllDoctorData").get(DoctorController.getAllDoctorDataa);
router.route("/:id").get(DoctorController.getDoctor);
router.route("/test/:id").get(DoctorController.getallDoctordata);

router
  .route("/update/:doctorId")
  .patch(authController.protect, DoctorController.updateDoctorData);

module.exports = router;
