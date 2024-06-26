const express = require("express");
const ClinicController = require("./../controllers/ClinicController");

const router = express.Router();

router.route("/").get(ClinicController.getAllClinic);
router.route("/AllClinicData").get(ClinicController.getAllClinicData);
router.route("/AllDoctorData").get(ClinicController.getAllDoctor);

router.route("/:id").get(ClinicController.ClinicsDoctor);

module.exports = router;
