const mongoose = require("mongoose");

const EventProgressSchema = mongoose.Schema({
  title: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Event",
  },
  status: {
    type: String,
    required: true,
  },
  progress: {
    type: Number,
    required: Boolean,
  },
});

module.exports = mongoose.model("EventProgress", EventProgressSchema);
