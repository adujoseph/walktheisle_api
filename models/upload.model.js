const mongoose = require("mongoose");

const UploadSchema = mongoose.Schema(
  {
    phone: {
      type: String,
    },
    userId: {
      type: String,
    },
    imageName: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);


const Uploads = mongoose.model("Uploads", UploadSchema);

module.exports = Uploads;