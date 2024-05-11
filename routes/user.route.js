const {
    adminResponse,
    createUser,
    privateResponse,
    sendProfile,
    signin,
    getAllUsers,
    getUser,
    createNewUser,
    requestOtp,
    validateOtp,
    requestVoiceOtp,
    searchUserByParams,
    checkInUser,
    changePassword,
    resetPassword,
    forgotPassword,
} = require("../controllers/user.controller");
const { newUserValidator } = require("../middleware/validator");
const UserModel = require("../models/user.model");
const { Router } = require("express");
const jwt = require('jsonwebtoken')

const router = Router();


const isAuth = async (req, res, next) => {
    try {
        const authorizationToken = req.headers.authorization;
        const token = authorizationToken?.split("Bearer ")[1];
        if (!token) return res.status(403).json({ error: "unauthorized access!" });

        const payload = jwt.verify(token, "secret");

        const user = await UserModel.findById(payload.id);
        if (!user) return res.status(403).json({ error: "unauthorized access!" });

        req.user = user;

        next();
    } catch (error) {
        if (error) {
            res.status(403).json({ error: "unauthorized access!" });
        } else {
            res.status(500).json({ error: "Something went wrong!" });
        }
    }
};

const isAdmin = async (req, res, next) => {
    if (req.user.role === "admin") next();
    else res.status(403).json({ error: "Protected only for admin!" });
};

const isOwner = async (req, res, next) => {
    if (req.user.role === "owner") next();
    else res.status(403).json({ error: "Protected only for admin!" });
};

const isAdminAndUser = async (req, res, next) => {
    if (req.user.role === "owner" | req.user.role === "admin") next();
    else res.status(403).json({ error: "Protected only for admin!" });
};

router.post("/signup", newUserValidator, createUser);

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Create User
 *     description: Register a new user with email, name, password, and phone number.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - name
 *               - password
 *               - phone
 *               - role
 *               - tableId
 *             properties:
 *               email:
 *                 type: string
 *                 description: The user's email address.
 *               role:
 *                 type: string
 *                 description: The user's role.
 *               tableId:
 *                 type: string
 *                 description: Tables.
 *               name:
 *                 type: string
 *                 description: The user's full name.
 *               password:
 *                 type: string
 *                 description: The user's password (should be hashed before storing).
 *               phone:
 *                 type: string
 *                 description: The user's phone number.
 *     tags:
 *       - Users
 *     responses:
 *       201:
 *         description: User created successfully.
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               description: Success message.
 *             userId:
 *               type: integer
 *               description: The ID of the newly created user (optional).
 *       400:
 *         description: Bad request. Please ensure the request body is valid.
 *       409:
 *         description: Conflict. A user with the same email address already exists.
 *       500:
 *         description: Internal server error.
 */
router.post("/", newUserValidator, createNewUser);

/**
 * @swagger
 * /api/users/signin:
 *   post:
 *     summary: Authenticate User
 *     description: Login an existing user with phone number and password.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *   
 *               - password
 *               - phone
 *             properties:
 *              
 *               password:
 *                 type: string
 *                 description: The user's password (should be hashed before storing).
 *               phone:
 *                 type: string
 *                 description: The user's phone number.
 *     tags:
 *       - Users
 *     responses:
 *       201:
 *         description: User created successfully.
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               description: Success message.
 *             userId:
 *               type: integer
 *               description: The ID of the newly created user (optional).
 *       400:
 *         description: Bad request. Please ensure the request body is valid.
 *       409:
 *         description: Conflict. A user with the same email address already exists.
 *       500:
 *         description: Internal server error.
 */
router.post("/signin", signin);

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get All Users
 *     description: Retrieve a list of all registered users.
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Users
 *     responses:
 *       200:
 *         description: List of users retrieved successfully.
 *         schema:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *                 description: The user's unique ID.
 *               name:
 *                 type: string
 *                 description: The user's full name.
 *               email:
 *                 type: string
 *                 description: The user's email address.
 *               phone:
 *                 type: string
 *                 description: The user's phone number (optional, depending on your implementation).
 *               # Add other user properties as needed
 *       401:
 *         description: Unauthorized. Invalid or missing JWT token.
 *       500:
 *         description: Internal server error.
 *
 */
router.get("/",  getAllUsers);


/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Get User by ID
 *     description: Retrieve details of a specific registered user.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         type: integer
 *         required: true
 *         description: The unique ID of the user to retrieve.
 *     tags:
 *       - Users
 *     responses:
 *       200:
 *         description: User details retrieved successfully.
 *         schema:
 *           type: object
 *           properties:
 *             id:
 *               type: integer
 *               description: The user's unique ID.
 *             name:
 *               type: string
 *               description: The user's full name.
 *             email:
 *               type: string
 *               description: The user's email address.
 *             phone:
 *               type: string
 *               description: The user's phone number (optional, depending on your implementation).
 *             # Add other user properties as needed
 *       401:
 *         description: Unauthorized. Invalid or missing JWT token.
 *       404:
 *         description: Not Found. User with the specified ID does not exist.
 *       500:
 *         description: Internal server error.
 *
 */
router.get("/:id",  getUser);



/**
 * @swagger
 * /api/users/search/:searchTerm:
 *   get:
 *     summary: Search Users
 *     description: Search for users based on phone number, name, or invite code..
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: searchTerm
 *         description: Search term (phone number, name, or invite code)
 *         type: string
 *         required: true
 *     tags:
 *       - Users
 *     responses:
 *       200:
 *         description: User details retrieved successfully.
 *         schema:
 *           type: object
 *           properties:
 *             id:
 *               type: integer
 *               description: The user's unique ID.
 *             name:
 *               type: string
 *               description: The user's full name.
 *             email:
 *               type: string
 *               description: The user's email address.
 *             phone:
 *               type: string
 *               description: The user's phone number (optional, depending on your implementation).
 *             # Add other user properties as needed
 *       401:
 *         description: Unauthorized. Invalid or missing JWT token.
 *       404:
 *         description: Not Found. User with the specified ID does not exist.
 *       500:
 *         description: Internal server error.
 *
 */
router.get("/search/:searchTerm", searchUserByParams);

/**
 * @swagger
 * /api/users/phone-validation:
 *   post:
 *     summary: Request OTP
 *     description: Check if the user is new and send otp.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - phone
 *             properties:
 *               phone:
 *                  type: string
 *     tags:
 *       - Users
 *     responses:
 *       200:
 *         description: User detail updated successfully.
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               description: Success message.
 *             userId:
 *               type: integer
 *               description: The ID of the newly created user (optional).
 *       400:
 *         description: Bad request. Please ensure the request body is valid.
 *       409:
 *         description: Conflict. A user with the same email address already exists.
 *       500:
 *         description: Internal server error.
 */
router.post("/phone-validation", requestOtp);

/**
 * @swagger
 * /api/users/voice-otp:
 *   post:
 *     summary: Request Voice OTP
 *     description: Send OTP to users as voice sms.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - phone
 *             properties:
 *               phone:
 *                  type: string
 *     tags:
 *       - Users
 *     responses:
 *       200:
 *         description: User detail updated successfully.
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               description: Success message.
 *             userId:
 *               type: integer
 *               description: The ID of the newly created user (optional).
 *       400:
 *         description: Bad request. Please ensure the request body is valid.
 *       409:
 *         description: Conflict. A user with the same email address already exists.
 *       500:
 *         description: Internal server error.
 */
router.post("/voice-otp", requestVoiceOtp);

/**
 * @swagger
 * /api/users/otp-validation:
 *   post:
 *     summary: Validate Otp
 *     description: Send pinIDs and Pins.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - phone
 *             properties:
 *               pin:
 *                  type: string
 *               pinId:
 *                  type: string
 *     tags:
 *       - Users
 *     responses:
 *       200:
 *         description: User detail updated successfully.
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               description: Success message.
 *             userId:
 *               type: integer
 *               description: The ID of the newly created user (optional).
 *       400:
 *         description: Bad request. Please ensure the request body is valid.
 *       409:
 *         description: Conflict. A user with the same email address already exists.
 *       500:
 *         description: Internal server error.
 */
router.post("/otp-validation", validateOtp);

/**
 * @swagger
 * /api/users/check-in:
 *   put:
 *     summary: Checkin User
 *     description: Check a user in at the event.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *               - isCheckedIn
 *             properties:
 *               isCheckedIn:
 *                 type: boolean
 *                 description: The user is checked in for event.
 *               userId:
 *                  type: string
 *     tags:
 *       - Users
 *     responses:
 *       200:
 *         description: User detail updated successfully.
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               description: Success message.
 *             userId:
 *               type: integer
 *               description: The ID of the newly created user (optional).
 *       400:
 *         description: Bad request. Please ensure the request body is valid.
 *       409:
 *         description: Conflict. A user with the same email address already exists.
 *       500:
 *         description: Internal server error.
 */
router.put("/check-in", checkInUser);

/**
 * @swagger
 * /api/users/change-password:
 *   put:
 *     summary: Change Password
 *     description: Change user's password.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - newPassword
 *               - oldPassword
 *             properties:
 *               newPassword:
 *                 type: string
 *                 description: The user is checked in for event.
 *               oldPassword:
 *                  type: string
 *     tags:
 *       - Users
 *     responses:
 *       200:
 *         description: User password updated successfully.
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               description: Success message.
 *             userId:
 *               type: integer
 *               description: The ID of the newly created user (optional).
 *       400:
 *         description: Bad request. Please ensure the request body is valid.
 *       409:
 *         description: Conflict. A user with the same email address already exists.
 *       500:
 *         description: Internal server error.
 */
router.put("/change-password", changePassword)

/**
 * @swagger
 * /api/users/reset-password:
 *   put:
 *     summary: Reset Password
 *     description: Reset users password with OTP.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - code
 *               - newPassword
 *             properties:
 *               code:
 *                 type: string
 *                 description: The user is checked in for event.
 *               newPassword:
 *                  type: string
 *     tags:
 *       - Users
 *     responses:
 *       200:
 *         description: User detail updated successfully.
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               description: Success message.
 *             userId:
 *               type: integer
 *               description: The ID of the newly created user (optional).
 *       400:
 *         description: Bad request. Please ensure the request body is valid.
 *       409:
 *         description: Conflict. A user with the same email address already exists.
 *       500:
 *         description: Internal server error.
 */
router.put("/reset-password", resetPassword)


/**
 * @swagger
 * /api/users/forgot-password:
 *   put:
 *     summary: Forgot Password
 *     description: User get an otp to reset their password.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - phone
 *             properties:
 *               phone:
 *                 type: string
 *                 description: The user phone number used while registering.
 *               userId:
 *                  type: string
 *     tags:
 *       - Users
 *     responses:
 *       200:
 *         description: User detail updated successfully.
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               description: Success message.
 *             userId:
 *               type: integer
 *               description: The ID of the newly created user (optional).
 *       400:
 *         description: Bad request. Please ensure the request body is valid.
 *       409:
 *         description: Conflict. A user with the same email address already exists.
 *       500:
 *         description: Internal server error.
 */
router.put("/forgot-password", forgotPassword)

router.get("/profile", isAuth, sendProfile);
router.get("/private", isAuth, privateResponse);
router.get("/admin", isAuth, isAdmin, adminResponse);

module.exports = router;