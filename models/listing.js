const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
  title: {
    type: String,
    required : true
  },
  description: {
    type: String,
  },
  image: {
    type: String,
    set : (v)=> v===""? "https://media.assettype.com/freepressjournal/2023-02/51ded765-ba46-4902-801b-5f7373f340d6/fdvcx.png?width=1200" : v ,
  },
  price: {
    type: Number,
  },
  location: {
    type: String,
  },
  country: {
    type: String,
  },
});

const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;
