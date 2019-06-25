let mongoose = require("mongoose");

//Article schema
let articleSchema = mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true
  },
  body: {
    type: String,
    required: true
  },
  addedDate: { 
    type: Date, 
    default: new Date()
  }
});

module.exports = mongoose.model("Article", articleSchema);