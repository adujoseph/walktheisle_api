
const axios = require('axios');
require('dotenv').config();
const sender_id = process.env.TERMII_SENDER_ID;
const api_key = process.env.TERMII_API_KEY;

const verifyOtp = async (pinId, pin) => {
    const apiKey = api_key;
    const senderID = sender_id;
    const url = 'https://api.ng.termii.com/api/sms/otp/verify';

    const data = {
        api_key: apiKey,
        pin_id: pinId,
        pin: pin
    };

    try {
       return await axios.post(url, data);
    } catch (error) {
        throw error
    }
}

module.exports = {
    verifyOtp
}