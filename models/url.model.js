const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const shortUrlSchema = new Schema({
  url: {
    type: String,
    required: true,
  },
  shortId: {
    type: String,
    required: true,
  },
});

const shortUrl = mongoose.model("ShortUrl", shortUrlSchema);

module.exports = shortUrl;
