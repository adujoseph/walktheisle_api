const Termii = require("termii-nodejs").Termii;
const sender_id = process.env.SENDER_ID;
const api_key = process.env.API_KEY;
const termii = new Termii({
    api_key: api_key,
	sender_id: sender_id,
    channel: "dnd",
	pin_attempts: 3,
	pin_time: 5,
	pin_length: 6,
	pin_type: "NUMERIC"
});

const sendOtp = (name, phoneNumber) => {
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

const sendSms = (recipient, message) => {
    
    const message = `Hello ${recipient?.name}, your OTP is ${pinPlaceholder}. This pin will expire in 1 minute.`;
    try{
        const response = termii.sendMessage(recipient?.phone, message);
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