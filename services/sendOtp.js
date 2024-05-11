const axios = require('axios');
require('dotenv').config();
const sender_id = process.env.TERMII_SENDER_ID;
const api_key = process.env.TERMII_API_KEY;

const sendOtp = async (phoneNumber) => {
    const apiKey = api_key;
    const senderID = sender_id;
    const url = 'https://api.ng.termii.com/api/sms/otp/send';

    const data = {
        api_key: apiKey,
        phone_number: phoneNumber,
        message_type: "NUMERIC",
        to: phoneNumber,
        from: "Joseph&Zion",
        channel: "generic",
        pin_attempts: 1,
        pin_time_to_live: 5,
        pin_length: 6,
        pin_placeholder: "< 123456 >",
        message_text: "Here is your OTP< 123456 >, Please note that this otp is for one time use. - Joseph & Zion",
        pin_type: "NUMERIC"

    };

    try {
        return await axios.post(url, data);
    } catch (error) {
        throw error
    }
}

module.exports = {
    sendOtp
}