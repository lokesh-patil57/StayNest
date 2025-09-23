const Listing = require("../models/listing");
const { Client } = require("@googlemaps/google-maps-services-js");

module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
};

module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");
  if (!listing) {
    req.flash("error", "Listing you requested for does not exist!");
    return res.redirect("/listings");
  }
  res.render("listings/show.ejs", { listing });
};

module.exports.createListing = async (req, res, next) => {
  const googleClient = new Client({});

  // Combine location and country for a more specific address
  const addressString = `${req.body.listing.location}, ${req.body.listing.country}`;

  let response = await googleClient.geocode({
    params: {
      address: addressString, // Use the combined string here
      key: process.env.GOOGLE_MAPS_API_KEY,
    },
  });

  if (!response.data.results.length) {
    req.flash("error", "Invalid location. Please provide a valid address.");
    return res.redirect("/listings/new");
  }

  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  newListing.image = { url: req.file.path, filename: req.file.filename };

  const location = response.data.results[0].geometry.location;
  newListing.geometry = {
    type: "Point",
    coordinates: [location.lng, location.lat],
  };

  await newListing.save();
  req.flash("success", "Listing Created successfully!");
  res.redirect(`/listings`);
};

module.exports.renderEditForm = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing you requested for does not exist!");
    return res.redirect("/listings");
  }
  let originalImageUrl = listing.image.url.replace(
    "/upload",
    "/upload/h_300,w_250"
  );
  res.render("listings/edit.ejs", { listing, originalImageUrl });
};

module.exports.updateListing = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

  if (req.body.listing.location && req.body.listing.country) {
    const googleClient = new Client({});

    // Combine location and country for a more specific address
    const addressString = `${req.body.listing.location}, ${req.body.listing.country}`;

    let response = await googleClient.geocode({
      params: {
        address: addressString, // Use the combined string here
        key: process.env.GOOGLE_MAPS_API_KEY,
      },
    });

    if (response.data.results.length) {
      const location = response.data.results[0].geometry.location;
      listing.geometry = {
        type: "Point",
        coordinates: [location.lng, location.lat],
      };
    }
  }

  if (typeof req.file !== "undefined") {
    listing.image = { url: req.file.path, filename: req.file.filename };
  }

  await listing.save();
  req.flash("success", "Listing Updated successfully!");
  res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing Deleted successfully!");
  res.redirect("/listings");
};
