const mongoose = require("mongoose");

const TablesSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter table name"],
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
      default: 0,
    },
    status: {
      type: Boolean,
      required: false,
      default: false,
    },

    image: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);


const Tables = mongoose.model("Tables", TablesSchema);

module.exports = Tables;