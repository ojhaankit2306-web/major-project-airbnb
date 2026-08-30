const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");


const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

async function main() {
  await mongoose.connect(MONGO_URL);
}

main()
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((err) => {
    console.log("DB Connection Error:", err);
  });
  app.set("view engine","ejs");
  app.set("views",path.join(__dirname,"views"));

  app.use(express.urlencoded({extended:true}));
  app.use(methodOverride("_method"));

app.get("/", (req, res) => {
  res.send("Hi, I am root");
});
//index route
app.get("/Listings",async(req,res) =>{
  const allListings = await Listing.find({});
  res.render("index.ejs",{ allListings});
})

app.get("/listing/new", (req, res) => {
  res.render("new.ejs");
});

//show route
app.get("/listings/:id",async(req,res)=>{
  let {id} = req.params;
  const listing = await Listing.findById(id);
  res.render("show.ejs",{listing})
})

app.post("/listings", async (req, res) => {
  const newListing = new Listing(req.body.listing);
  await newListing.save();
  res.redirect("/listings");
});

app.get("/listings/:id/edit", async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("edit.ejs", { listing });
});

app.put("/listings/:id", async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  res.redirect(`/listings/${id}`); // Redirect back to show page
});
//delete
app.delete("/listings/:id", async (req, res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  console.log("Deleted listing:", deletedListing);
  res.redirect("/listings"); 
});




app.listen(8080, () => {
  console.log("Server is listening on port 8080");
});