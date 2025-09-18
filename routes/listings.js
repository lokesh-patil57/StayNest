const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { listingSchema, reviewSchema } = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");
const flash = require("connect-flash");
const { isLoggedin, isOwner } = require("../middleware.js");
const { validateListing } = require("../middleware.js");
const multer = require("multer");
const { storage } = require("../cloudconfig.js");
const upload = multer({ storage });

const listingController = require("../controllers/listings.js");

router
  .route("/")
  .get(wrapAsync(listingController.index))
  .post(
    isLoggedin,
    validateListing,
    upload.single("listing[image]"),
    wrapAsync(listingController.createListing)
  );
//New route
router.get("/new", isLoggedin, listingController.renderNewForm);

router
  .route("/:id")
  .get(wrapAsync(listingController.showListing))
  .put(
    isLoggedin,
    isOwner,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.updateListing)
  )
  .delete(isLoggedin, wrapAsync(listingController.destroyListing));

//Edit Route
router.get(
  "/:id/edit",
  isLoggedin,
  wrapAsync(listingController.renderEditForm)
);

module.exports = router;
