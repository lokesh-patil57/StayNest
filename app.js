const express = require("express");
const app = express();
const mongoose = require("mongoose");
const MONGO_URL = "mongodb://127.0.0.1:27017/StayNest";
const Listing = require("../StayNest/models/listing.js");
const path = require("path")

app.set("view engine" , "ejs")
app.set("views" , path.join(__dirname,"views"))

main()
  .then(() => {
    console.log(`connected to mongoDB`);
  })
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect(MONGO_URL);
}

//Index Route


//Show Route
app.get("/listing/:id" , async (req , res)=>{
 let {id} = req.params
 const listing = await Listing.findById(id)
 res.render("listings/show.ejs" , {listing})
})

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

app.listen(8080, (req, res) => {
  console.log(`app is listening on port 8080`);
  console.log(`http://localhost:8080`);
});
