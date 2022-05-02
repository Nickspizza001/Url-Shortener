const express = require("express");

const shortid = require("shortid");
const mongoose = require("mongoose");
const createHttpError = require("http-errors");
const path = require("path");
const shortUrl = require("./models/url.model");

const app = express();

mongoose
  .connect("mongodb://localhost:27017", {
    useNewUrlParser: true,
    dbName: "ShortUrl",
  })
  .then(() => {
    console.log("Mongo connected");
  });

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.set("view engine", "ejs");

app.get("/", async (req, res, next) => {
  res.render("index");
});

app.post("/", async (req, res, next) => {
  try {
    const { url } = req.body;

    if (!url) {
      throw createHttpError.BadRequest("Provide a valid url");
    }
    const duplicate = await shortUrl.findOne({ url: url });
    console.log("Duplicate");
    // res.send(duplicate.shortId)
    if (duplicate) {
      res.render("index", {
        short_url: `http://dwarfLink/${duplicate.shortId}`,
        real_url: url
      });

      return;
    }
    const newshortUrl = new shortUrl({
      url: url,
      shortId: shortid.generate(),
    });
    const result = await newshortUrl.save();

    res.render("index", {
      short_url: `http://dwarfLink/${result.shortId}`,
      real_url: url
    });
    return;
  } catch (error) {
    console.log(error);
    next();
  }
});



app.use((req, res, next) => {
  next(createHttpError.NotFound())
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.render("index", { error: err.message });
});

app.listen(5000, () => {
  console.log(`server running on port 5000`);
});
