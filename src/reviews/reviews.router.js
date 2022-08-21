const express = require("express");
const methodNotAllowed = require("../errors/methodNotAllowed");
const router = express.Router();
const controller = require("./reviews.controller");

router
  .route("/:reviewId")
  .get(controller.read)
  .put(controller.update)
  .delete(controller.delete)
  .all(methodNotAllowed)

module.exports = router;
