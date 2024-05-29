const mongoose = require("mongoose");

const UploadSchema = mongoose.Schema(
  {
    phone: {
      type: String,
    },
    imageName: {
      type: String,
    },
    imageUrl: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);


const Uploads = mongoose.model("Uploads", UploadSchema);

module.exports = Uploads;