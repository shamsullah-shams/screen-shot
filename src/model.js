const mongoose = require("mongoose");

const modelSchema = mongoose.Schema(
  {
    visitorId: {
      type: String,
      required: true,
    },
    option: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

/**
 * @typedef Model
 */
const Model = mongoose.model("Model", modelSchema);

module.exports = Model;
