const UserModel = require("../models/user.model");
const jwt = require('jsonwebtoken')
const { v4: uuidv4 } = require('uuid');
const QRCode = require('qrcode');
const otpService = require('../services/otpService');
const { generateInviteCode } = require("../helper/generateInviteCode");
const { sendOtp } = require("../services/sendOtp");
const { verifyOtp } = require("../services/verifyOtp");
const { sendSms } = require("../services/sendSms");
const { sendVoiceOtp } = require("../services/sendVoiceOtp");
const { hash, compare, genSalt } = require("bcrypt");
const Otp = require('../models/otp.model');
const { OtpNumber } = require("../helper/generateOTPCode");
const { sendEmail } = require("../services/sendEmail");


const createUser = async (req, res) => {
  // const { email, name, password, role, table } = req.body;

  // const oldUser = await UserModel.findOne({ email });
  // if (oldUser)
  //   return res.status(403).json({ error: "The email is already in use!" });

  // const user = await UserModel.create({ email, password, name, role, table });

  // res.json({ success: true, user });
};

const createNewUser = async (req, res) => {
  const { name, tableId, email, phone, password, role } = req.body;


  if (!name || !email || !phone || !password || !role || !tableId) {
    return res.status(400).json({ message: 'Missing required fields' });
  }
  if(phone.length !== 13){
    return res.status(400).json({ message: 'Invalid phone number' });
  }

  try {
    const existingPhone = await UserModel.findOne({ phone });
    const existingEmail = await UserModel.findOne({ email });
    if (existingPhone) {
      return res.status(409).json({ message: 'phone number already exists' });
    }
    if (existingEmail) {
      return res.status(409).json({ message: 'email address already exists' });
    }

    // const inviteCode = uuidv4(); 
    const inviteCode = generateInviteCode(tableId, phone)
    const qrCodeUrl = await generateQRCodeUrl(inviteCode);
    const newUser = new UserModel({
      name,
      tableId,
      email,
      phone,
      password,
      role,
      inviteCode,

    });
    const savedUser = await newUser.save();
    const token = jwt.sign({ userId: savedUser._id }, 'your_secret_key', { expiresIn: '1h' });
    let message = `Hello ${name}, Thank you for registering to be a path of our big day. Your invite code is ${inviteCode} and please note that this invite will only admit one person - Joseph & Zion`
    const response = await sendSms(phone, message)
    console.log({response}, 'My Response here')
    res.status(201).json({
      message: 'User created successfully',
      data: {
        qrCodeUrl,
        token,
        tableId,
        inviteCode,
        name
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }

}

const signin = async (req, res) => {
  const { email, password, phone } = req.body;

  const user = await UserModel.findOne({ phone });
  if (!user) return res.status(404).json({ error: "User not found!" });

  const isMatched = await user.comparePassword(password);
  if (!isMatched) {
    return res.status(403).json({ error: "Email/Password doesn't match!" });
  }

  //   user is there and password is cool
  const token = jwt.sign({ id: user._id.toString() }, "secret");
  const qrCodeUrl = await generateQRCodeUrl(user.inviteCode);

  res.json({
    success: true,
    token,
    profile: { name: user.name, role: user.role, email: user.email, accessCode: user.inviteCode, table: user.tableId , phone: user.phone, isCheckedIn: user.
      isCheckedIn, qrCodeUrl},
  });
};

const getAllUsers = async (req, res) => {
  const user = await UserModel.find({});
  if (!user) return res.status(404).json({ message: 'No user is registered yet' })
  res.status(200).json({ user })
}

const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await UserModel.findById(id);
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const requestOtp = async (req, res) => {
  const { phone } = req.body
  const existingPhone = await UserModel.findOne({ phone });
  if (existingPhone) {
    return res.status(409).json({ message: 'phone number already exists, please login instead' });
  }

  try {
    const phoneNumber = req.body.phone
    if (!phoneNumber || phoneNumber.length > 13) {
      res.status(401).json({ data: null, message: 'Please enter valid phone number' })
      return
    }
    const { data, status } = await sendOtp(phoneNumber)
    console.log(data, status)
    res.status(200).json({ data: data, message: 'Successful' });
  } catch (err) {
    res.status(422).json({ data: null, message: err })
  }
}

const requestVoiceOtp = async (req, res) => {
  try {
    const phoneNumber = req.body.phone
    if (!phoneNumber || phoneNumber.length > 13) {
      res.status(401).json({ data: null, message: 'Please enter valid phone number' })
      return
    }
    const { data, status } = await sendVoiceOtp(phoneNumber)
    console.log(data, status)
    res.status(200).json({ data: data, message: 'Successful' });
  } catch (err) {
    res.status(422).json({ data: null, message: err })
  }
}

const checkInUser = async (req, res) => {
  try {
    const { id } = req.body;
    if (!id) {
      return res.status(404).json({ message: "ID is not found" });
    }
    const updateUser = await UserModel.findByIdAndUpdate(id, req.body);
    if (!updateUser) {
      return res.status(404).json({ message: "User with this ID is not found" });
    }
    const updatedUser = await UserModel.findById(id);
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
const changePassword = async (req, res) => {
  try {

    const { phone, currentPassword, newPassword } = req.body;

    // Find the user by ID
    const user = await UserModel.findOne({ phone });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Validate current password
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({ message: 'Incorrect current password' });
    }

    // Hash the new password
    const salt = await genSalt(10);
    user.password = await hash(newPassword, salt);

    // Save the updated user
    await user.save();

    res.status(200).json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

const resetPassword = async (req, res) => {
  try {

    const { phone, code, newPassword } = req.body;

    if (!phone || phone.length !== 13) {
      return res.status(409).json({ message: 'Enter valid otp code' });
    }
    if (!code || code.length !== 6) {
      return res.status(409).json({ message: 'Enter valid otp code' });
    }
    const user = await UserModel.findOne({ phone });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const validOtp = await Otp.findOne({
      email: user?.email,
      otp: code,
      expiresAt: { $gt: Date.now() }, // Check for unexpired OTP
    });

    if (validOtp) {
      const salt = await genSalt(10);
      user.password = await hash(newPassword, salt);
      await user.save();
      await Otp.deleteOne({email:  user?.email });
      return res.status(200).json({ message: 'Password reset is successful' });
    } else {
      return res.status(409).json({ message: 'Otp code is no longer valid' });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
}

const forgotPassword = async (req, res) => {
  try {
    const { phone } = req.body;
    const user = await UserModel.findOne({ phone });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const otp = await OtpNumber(6);
    const data = {
      email: user?.email,
      otp
    }

    const existingEmail = await Otp.findOne({ email: user?.email })
    if (existingEmail) {
      await Otp.findOneAndUpdate({
        email: user?.email, 
        otp,
        expiresAt: Date.now() + 10 * 60 * 1000
      })
    } else {
      await Otp.create(data);
    }
    // Send OTP to user here
    res.status(200).json({ message: "Otp sent succesffuly" });
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Internal server error' });
  }
}


const updateUserDetails = async (req, res) => {
  try {
    const { id } = req.body;
    if (!id) {
      return res.status(404).json({ message: "ID is not found" });
    }
    const updateUser = await UserModel.findByIdAndUpdate(id, req.body);
    if (!updateUser) {
      return res.status(404).json({ message: "User with this ID is not found" });
    }
    res.status(200).json(updateUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

const searchUserByParams = async (req, res) => {
  const { searchTerm } = req.query;
  if (!searchTerm) {
    return res.status(400).send('Please provide a search term (phone, name, or invite code)');
  }

  try {
    const users = await UserModel.find({
      "$or": [
        { phone: { $regex: new RegExp(searchTerm, 'i') } },
        { name: { $regex: new RegExp(searchTerm, 'i') } },
        { inviteCode: searchTerm },
      ]
    });
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching users');
  }
}


const validateOtp = async (req, res) => {
  const pin = req.body.pin;
  const pinId = req.body.pinId;
  if (!pin || pin.length !== 6) {
    res.status(401).json({ data: null, message: 'Enter valid pin' })
    return
  }
  if (!pinId) {
    res.status(401).json({ data: null, message: 'Enter valid pin ID' })
    return
  }
  const { data, status } = await verifyOtp(pinId, pin)
  if (status === 200) res.status(200).json({ data, message: 'Successful' });
  res.status(422).json({ data: null, message: 'An error occured' })

}

const privateResponse = async (req, res) => {
  res.json({ message: "Cool man you are in the private property!" });
};

const adminResponse = async (req, res) => {
  res.json({ message: "Welcome boss I know you are our admin!" });
};

const sendProfile = (req, res) => {
  res.json({
    profile: {
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
    },
  });
};

async function generateQRCodeUrl(inviteCode) {
  const qrData = JSON.stringify({ inviteCode });
  const qrImage = await QRCode.toDataURL(qrData, {
    type: 'png',
    margin: 2,
    scale: 10,
  });

  return qrImage; // Replace with your logic to store or serve the image
}


module.exports = {
  sendProfile,
  adminResponse,
  privateResponse,
  signin,
  createUser,
  createNewUser,
  getAllUsers,
  getUser,
  requestOtp,
  validateOtp,
  requestVoiceOtp,
  searchUserByParams,
  checkInUser,
  changePassword,
  resetPassword,
  forgotPassword,
}