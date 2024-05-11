const Upload = require("../models/upload.model")
const { S3Client, PutObjectCommand, GetObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const { randomImageName } = require('../helper/randomImageName');
require('dotenv').config()

const bucketname = process.env.S3_BUCKET_NAME
const bucketzone = process.env.S3_BUCKET_ZONE
const bucketkey = process.env.S3_ACCESS_KEY
const bucketsecret = process.env.S3_SECRET_KEY


const s3 = new S3Client({
    credentials: {
        accessKeyId: bucketkey,
        secretAccessKey: bucketsecret
    },
    region: bucketzone
})

const uploadImage = async (req, res) => {
console.log(req.file, "file")
    try {
        const params = {
            Bucket: bucketname,
            Key: randomImageName(),
            Body: req.file.buffer,
            ContentType: req.file.mimetype
        }
        const command = new PutObjectCommand(params)
        await s3.send(command)
        let data = {
            phone: req.file.phone,
            userId: req.file.userId,
            imageName: randomImageName()
        }
        console.log({data})
        const upload = await Upload.create(data);
        res.status(200).json({ data: upload, message: 'image uploaded successfully' })
    } catch (error) {
        res.status(500).json({ data: null, message: error.message });
    }
};


const getAllImages = async (req, res) => {
    try {
        const images = await Upload.find({});
        for(image of images) {
            console.log('array', image)
            const getObjectParams = {
                Bucket: bucketname,
                Key: image.imageName,
            }
            const command = new GetObjectCommand(getObjectParams);
            const url = await getSignedUrl(s3, command, { expiresIn: 36000 });
            console.log({url})
            image.imageUrl = url
        }
        res.status(200).json({ data: images, message: "image fetched successfully" })
    } catch (error) {
        res.status(500).json({ data: null, message: error.message });
    }
};

module.exports = {
    getAllImages,
    uploadImage
};