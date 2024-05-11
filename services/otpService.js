const Termii = require("termii-nodejs").Termii;
require('dotenv').config();
const sender_id = process.env.TERMII_SENDER_ID;
const api_key = process.env.TERMII_API_KEY;

const termii = new Termii({
    api_key: api_key,
	sender_id: sender_id,
    channel: "generic",
	pin_attempts: 3,
	pin_time: 5,
	pin_length: 6,
    pin_type:'numeric',
    message_type : "text",
});

const sendOtp = (name, phoneNumber,) => {
    console.log('Name')
    const pinPlaceholder = '< 123456 >';
    const message = `Hello ${name}, your OTP is ${pinPlaceholder}. Do not share your OTP with anyone.`;
    try{
        const response = termii.sendToken(phoneNumber, pinPlaceholder, message);
        return response;
    }
    catch(err){
        throw err;
    }
}

const sendSms = (phone, name, inviteCode) => {
    let message = `Hello ${name}, Thank you for your interest in attending our wedding. Your invite code is ${inviteCode}. Lots of Love - Zion & Joseph`;
    try{
        const response = termii.sendMessage(phone, message);
        return response;
    }
    catch(err){
        throw err;
    }
}

const verifyOtp = (pinId, pin) => {
    try{
        const response = termii.verifyToken(pinId, pin);
        return response;
    }
    catch(err){
        throw err;
    }
}

module.exports  = {
    sendOtp,
    sendSms,
    verifyOtp
}