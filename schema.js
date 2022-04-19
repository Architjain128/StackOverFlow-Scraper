const mongoose = require("mongoose");

const Data = new mongoose.Schema({
    title: { type: String },
    url: { type: String },
    votes: { type: Number },
    answer: { type: Number },
    frequency: { type: Number },
});

module.exports = mongoose.model("Data", Data);