


const axios = require('axios');
require('dotenv').config();
const sender_id = process.env.TERMII_SENDER_ID;
const api_key = process.env.TERMII_API_KEY;

const sendSms = async (phoneNumber, message) => {
    const apiKey = api_key;
    const senderID = sender_id;
    const url = 'https://api.ng.termii.com/api/sms/send';

    const data = {
        api_key: apiKey,
        phone_number: phoneNumber,
        to: phoneNumber,
        from: "Joseph&Zion",
        channel: "generic",
        sms: message,
        type: "plain",
        pin_type: "NUMERIC"
    };

    try {
        return await axios.post(url, data);
    } catch (error) {
        throw error
    }
}

module.exports = {
    sendSms
}