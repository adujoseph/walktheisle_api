const express = require("express");
const router = express.Router();
const { uploadImage, getAllImages, getPutLink, finalizeUpload } = require("../controllers/upload.controller");
const multer = require('multer')
const storage = multer.memoryStorage();
const upload = multer({storage})



router.post('/get-put-link',getPutLink);

router.post('/finalize-upload',finalizeUpload);



/**
 * @swagger
 * /api/uploads:
 *   post:
 *     summary: Upload Image
 *     description: Upload an image file to the server.
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: formData
 *         name: image
 *         type: file
 *         required: true
 *         description: The image file to upload.
 *     tags:
 *       - Uploads
 *     responses:
 *       200:
 *         description: Image uploaded successfully.
 *         schema:
 *           type: object
 *           properties:
 *             filename:
 *               type: string
 *               description: The uploaded image filename.
 *             url:
 *               type: string
 *               description: The URL of the uploaded image (optional, depending on your implementation).
 *       400:
 *         description: Bad request. Please ensure the request is formatted correctly.
 *       500:
 *         description: Internal server error.
 *
 */
router.post('/', upload.single('image'), uploadImage);


/**
 * @swagger
 * /api/uploads:
 *   get:
 *     summary: Get All Images
 *     description: Retrieves a list of URLs for all images stored in the specified S3 bucket.
 *     tags:
 *       - Uploads
 *     security:
 *       - JWTAuth: []
 *     responses:
 *       200:
 *         description: List of image URLs retrieved successfully.
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *             description: The URL of an image in the S3 bucket.
 *       400:
 *         description: Bad request. Please ensure the request parameters are valid.
 *       403:
 *         description: Forbidden access. The user might not have permission to access the S3 bucket.
 *       500:
 *         description: Internal server error.
 *
 */
router.get('/', getAllImages);

module.exports = router;