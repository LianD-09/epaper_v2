const express = require("express");

const {
  getAllData,
  getDataById,
  createData,
  updateData,
  deleteData,
} = require("../controllers/DataController");

const auth = require("../auth/auth");
const { createDataNoMqtt, updateDataNoMqtt } = require("../services/DataService");
const router = express.Router();

router.use(auth);
router.route("/").get(getAllData).post(createData);
router.route("/:id").get(getDataById).put(updateData).delete(deleteData);

// no mqtt
router.route("/n").post(createDataNoMqtt);
router.route("/n/:id").put(updateDataNoMqtt);

module.exports = router;