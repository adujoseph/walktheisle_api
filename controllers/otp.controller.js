const { OtpNumber } = require('../helper/generateOTPCode');
const Otp = require('../models/otp.model');
const UserModel = require('../models/user.model');
const { sendSms } = require('../services/otpService');
const { sendEmail } = require('../services/sendEmail');

const generateOTP = async (req, res) => {
    const { email, phone } = req.body
    if (!email || !phone || phone.length > 13) {
        return res.status(401).json({ message: 'Enter email' })
    }
    if (!phone || phone.length > 13) {
        return res.status(401).json({ message: 'Enter email and phone number' })
    }

    const userExist = await UserModel.findOne({ email });
    if (userExist) {
        return res.status(409).json({ message: 'user with similar credential already exist' })
    }

    const userExist_ = await UserModel.findOne({ phone });
    if (userExist_) {
        return res.status(409).json({ message: 'user with similar credential alredy exist' })
    }
    const otp = await OtpNumber(6);
    const data = {
        email,
        otp
    }


    try {
        const existingEmail = await Otp.find({ email })
        if (existingEmail.length) {
            await Otp.findOneAndUpdate({
                email,
                otp,
                expiresAt: Date.now() + 10 * 60 * 1000
            })
        } else {
            await Otp.create(data);
        }
        const message = `Your OTP from AduraTemi 2024 is here :${otp}`
        await sendEmail(email, otp)
        await sendSms(phone, message)
        res.status(200).json({ message: "Otp sent succesffuly" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }

}

const validateOTP = async (req, res) => {
    const { email, otp } = req.body
    try {
        // Find a valid, unexpired OTP for the user
        const validOtp = await Otp.findOne({
            email,
            otp,
            expiresAt: { $gt: Date.now() }, // Check for unexpired OTP
        });

        console.log(validOtp)

        if (validOtp) {
            // OTP is valid, remove it from storage to prevent reuse
            await Otp.deleteOne({ email });
            return res.status(200).json({ message: 'Otp validation is successful' });
        } else {
            return res.status(409).json({ message: 'Otp code is expired' });
        }
    } catch (error) {
        console.error('Error validating OTP:', error);
        return res.status(409).json({ message: error.message });
    }
}

module.exports = {
    validateOTP,
    generateOTP
}