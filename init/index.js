const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");
const { Client } = require("@googlemaps/google-maps-services-js"); // Import Google client
require("dotenv").config({ path: "../.env" }); // Make sure to load .env variables

const MONGO_URL = "mongodb://127.0.0.1:27017/StayNest";

main()
  .then(() => {
    console.log(`connected to mongoDB`);
  })
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
  // 1. Clear existing data
  await Listing.deleteMany({});
  console.log("Deleted existing listings.");

  // 2. Initialize Google client once
  const googleClient = new Client({});

  // 3. Loop through each sample listing to add geometry
  for (let listingData of initData.data) {
    try {
      // Geocode the location from sample data
      let response = await googleClient.geocode({
        params: {
          address: `${listingData.location}, ${listingData.country}`,
          key: process.env.GOOGLE_MAPS_API_KEY,
        },
      });

      if (!response.data.results.length) {
        console.log(`Could not geocode location: ${listingData.location}`);
        continue; // Skip this listing if location is invalid
      }

      const location = response.data.results[0].geometry.location;

      // Create a new Listing instance with all required data
      const newListing = new Listing({
        ...listingData,
        owner: "68c24b58ac04d8d8bb5880f8", // Your default owner ID
        geometry: {
          type: "Point",
          coordinates: [location.lng, location.lat],
        },
      });

      // Save the new listing to the database
      await newListing.save();
    } catch (err) {
      console.error(
        `Error processing listing "${listingData.title}":`,
        err.message
      );
    }
  }

  console.log("Data was Initialized with geocoded coordinates!");
};

initDB().then(() => {
  mongoose.connection.close(); // Close connection after script is done
});
