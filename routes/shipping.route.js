const express = require("express");
const router = express.Router();
const shippingController = require("../controllers/shipping.controller");
const passport = require("passport");

router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  shippingController.createShipping
);
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  shippingController.getShippings
);

module.exports = router;
