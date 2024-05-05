const mongoose = require("mongoose");

const UploadSchema = mongoose.Schema(
  {
    name: {
      type: String,
      unique: true
    },
    fancy: {
        type: String,
        unique: true
      },
  },
  {
    timestamps: true,
  }
);


const Uploads = mongoose.model("Uploads", UploadSchema);

module.exports = Uploads;