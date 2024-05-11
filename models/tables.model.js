const mongoose = require("mongoose");

const TablesSchema = mongoose.Schema(
  {
    name: {
      type: String,
      unique: true
    },
    alias: {
        type: String,
        required: [true, "Please enter table alias"],
        unique: true
      },
    capacity: {
      type: Number,
      required: true,
      default: 10,
    },
    status: {
      type: Boolean,
      required: false,
      default: false,
    },
    description: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);


const Tables = mongoose.model("Tables", TablesSchema);

module.exports = Tables;