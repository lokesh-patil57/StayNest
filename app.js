const express = require("express");
const app = express();
const mongoose = require("mongoose");
const MONGO_URL = "mongodb://127.0.0.1:27017/StayNest";
const Listing = require("../StayNest/models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressErrors.js");

app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

main()
  .then(() => {
    console.log(`connected to mongoDB`);
  })
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect(MONGO_URL);
}

//Index Route
app.get("/listings",wrapAsync( async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
}));

//Create new route
app.get("/listings/new", (req, res) => {
  res.render("listings/new.ejs");
});

//Show Route
app.get("/listing/:id",wrapAsync( async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/show.ejs", { listing });
}));

//Edit Route
app.get("/listings/:id/edit",wrapAsync( async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  res.render("listings/edit.ejs", { listing });
}));

//Upadate Route
app.put("/listings/:id",wrapAsync( async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  res.redirect(`/listing/${id}`);
}));

// Destroy Route
app.delete("/listings/:id",wrapAsync( async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndDelete(id);
  res.redirect("/listings");
}));

//Create Route
app.post(
  "/listings",
  wrapAsync(async (req, res) => {
    if(!req.body.listings){
      throw new ExpressError(400,"Send Valid Data For Request!")
    }
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect(`/listings/${id}`);
  })
);

// app.get("/testlisting" , async (req , res) =>{
//     let sampleListing = new Listing({
//         title : "New Villa !!",
//         description: "near Goa Beach !!",
//         price : 1200,
//         location : "Calangute , Goa",
//         country : "India"
//     })
//     await sampleListing.save()
//     console.log(`Sample was Saved`);
//     res.send("Successful testing")

// })



app.get("/", (req, res) => {
  res.send("I am Root");
});

app.use((err,req,res,next)=>{
  let {statusCode=500 , message="Something went wrong"}= err
  res.status(statusCode).send(message)
})

app.listen(8080, (req, res) => {
  console.log(`app is listening on port 8080`);
  console.log(`http://localhost:8080`);
});

