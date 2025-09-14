const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { listingSchema, reviewSchema } = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");
const flash = require("connect-flash");
const { isLoggedin, isOwner } = require("../middleware.js");
const { validateListing } = require("../middleware.js");

const listingController = require("../controllers/listings.js");

//Index Route
router.get("/", wrapAsync(listingController.index));

//New route
router.get("/new", isLoggedin, listingController.renderNewForm);

//Show Route
router.get("/:id", wrapAsync(listingController.showListing));

//Create Route
router.post(
  "/",
  isLoggedin,
  validateListing,
  wrapAsync(listingController.createListing)
);

//Edit Route
router.get(
  "/:id/edit",
  isLoggedin,
  wrapAsync(listingController.renderEditForm)
);

//Upadate Route
router.put(
  "/:id",
  validateListing,
  isLoggedin,
  isOwner,
  wrapAsync(listingController.updateListing)
);

// Destroy Route
router.delete("/:id", isLoggedin, wrapAsync(listingController.destroyListing));

module.exports = router;
