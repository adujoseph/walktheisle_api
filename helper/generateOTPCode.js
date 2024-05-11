const randomstring = require('randomstring');

function generateOTP() {
    // Create an empty array to store the generated digits
    const digits = [];

    // Loop 6 times to generate 6 digits
    for (let i = 0; i < 6; i++) {
        let digit;

        // Generate a random digit between 0 and 9 (inclusive)
        do {
            digit = Math.floor(Math.random() * 10); // 0-9
        } while (digits.includes(digit)); // Check for uniqueness

        // Add the unique digit to the array
        digits.push(digit);
    }

    // Join the digits into a string and return the OTP
    return digits.join('');
}


const OtpNumber = (length) => {
    return randomstring.generate({
        length: length,
        charset: 'numeric', // Ensure numeric digits
    });

}

module.exports = {
    OtpNumber
}