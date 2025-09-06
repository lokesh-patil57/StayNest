const express = require("express");
const app = express();
const mongoose = require("mongoose");
const MONGO_URL = "mongodb://127.0.0.1:27017/StayNest";
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const listings = require("./routes/listings.js");
const reviews = require("./routes/review.js")

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

app.get("/", (req, res) => {
  res.send("I am Root");
});




app.use("/listings",listings)
app.use("/listings/:id/reviews",reviews)


// app.all("*",(err,req,res,next)=>{
//   next(new ExpressError(400,"Page Not Found!"))
// })

app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went Wrong!" } = err;
  res.status(statusCode).render("error.ejs", { message });
  // res.status(statusCode).send(message)
});

app.listen(8080, (req, res) => {
  console.log(`app is listening on port 8080`);
  console.log(`http://localhost:8080`);
});
