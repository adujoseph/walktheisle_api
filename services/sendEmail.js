const axios = require('axios');
require('dotenv').config();
const sender_id = process.env.TERMII_SENDER_ID;
const api_key = process.env.TERMII_API_KEY;

const sendEmail = async (email, code) => {
    const apiKey = api_key;
    const senderID = sender_id;
    const url = 'https://api.ng.termii.com/api/email/otp/send';
    const data = {
        api_key: apiKey,
        email_address: email,
        code,
        email_configuration_id: "29b163e9-9286-480d-9b07-be265cd63bbf"
    };

    try {
        return await axios.post(url, data);
    } catch (error) {
        throw error
    }
}

module.exports = {
    sendEmail
}