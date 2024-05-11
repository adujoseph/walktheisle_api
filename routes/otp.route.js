const { Router } = require("express");
const OtpModel = require("../models/otp.model");
const router = Router();
const { generateOTP, validateOTP } = require('../controllers/otp.controller');
const { emailValidator } = require("../middleware/validator");


/**
 * @swagger
 *  /api/otp/generate:
 *   post:
 *     summary: Generate OTP
 *     description: Generates a One-Time Password and sends it to the provided email address.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 description: The user's email address to which the OTP will be sent.
 *     tags:
 *       - OTP
 *     responses:
 *       200:
 *         description: OTP generated successfully.
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               description: Success message indicating OTP generation.
 *       400:
 *         description: Bad request. Please ensure the request body is valid (email is missing or invalid).
 *       500:
 *         description: Internal server error. OTP generation failed.
 */
router.post("/generate", emailValidator, generateOTP);



/**
 * @swagger
 * /api/otp/validate:
 *   post:
 *     summary: Validate OTP
 *     description: Validate the otp sent to the user via mail or sms.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - otp
 *             properties:
 *               email:
 *                 type: string
 *                 description: The user's email address to which the OTP will be sent.
 *               otp:
 *                 type: string
 *                 description: The user's email address to which the OTP will be sent.
 *     tags:
 *       - OTP
 *     responses:
 *       200:
 *         description: OTP generated successfully.
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               description: Success message indicating OTP generation.
 *       400:
 *         description: Bad request. Please ensure the request body is valid (email is missing or invalid).
 *       500:
 *         description: Internal server error. OTP generation failed.
 */
router.post("/validate", emailValidator, validateOTP);


module.exports = router;