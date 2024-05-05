const { Schema, model} =require('mongoose');
const { hash, compare, genSalt }  = require("bcrypt");


const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
        type: String,
        required: true,
        trim: true,
        unique: true,
      },
    email: {
      type: String,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    tableId: {
        type: String,
        required: true
      },
    role: {
      type: String,
      enum: ["user", "admin", "owner"],
      default: "user",
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  const salt = await genSalt(10);
  this.password = await hash(this.password, salt);
});

userSchema.methods.comparePassword = async function (password) {
  return await compare(password, this.password);
};

const UserModel = model("User", userSchema);

module.exports = UserModel;
