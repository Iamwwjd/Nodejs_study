const mongoose = require("mongoose");
const { Schema } = require("mongoose");
const shortId = require("./types/short-id");
 
module.exports = new Schema(
  {
    shortId,
    title: String,
    content: String,
    author: String,
  },
  {
    timestamps: true,
  }
);