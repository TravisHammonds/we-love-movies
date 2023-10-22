const router = require("express").Router();
const methodNotAllowed = require("../errors/methodNotAllowed");
const controller = require("./reviews.controller");

router
    .route("/:reviewId")
    .delete(controller.delete)
    .put(controller.update)
    .all(methodNotAllowed);

module.exports = router;
