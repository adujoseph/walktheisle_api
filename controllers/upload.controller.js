const Upload = require("../models/upload.model")
const { S3Client, PutObjectCommand, GetObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const { randomImageName } = require('../helper/randomImageName');
const mime = require('mime-types')
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

 
const getS3PutLink = () => {
    
}

const uploadImage = async (req, res) => {

    // const { filename , fileSize, fileType, phone} = req.body;
    // const uniqueKeyName = `${Date.now().toString()}-${encodeURIComponent(filename)}`
    // const mimeType = mime(filename);


    try {
        const params = {
            Bucket: bucketname,
            Key: `${Date.now().toString()}-${encodeURIComponent(req.file.originalname)}`,
            Body: req.file.buffer,
            ContentType: req.file.mimetype
        }
        const command = new PutObjectCommand(params)
        const resp = await s3.send(command)
        console.log(resp)
        let data = {
            phone: req.body.phone,
            userId: req.body.userId,
            imageName: `${Date.now().toString()}-${encodeURIComponent(req.file.originalname)}`
        }
       
        const upload = await Upload.create(data);
        const uploadUrl = `https://${bucketname}.s3.amazonaws.com/${Date.now().toString()}-${encodeURIComponent(req.file.originalname)}`
        console.log(uploadUrl)
        res.status(200).json({ data: upload, message: 'image uploaded successfully' })
    } catch (error) {
        res.status(500).json({ data: null, message: error.message });
    }
};


const getAllImages = async (req, res) => {
    try {
        const images = await Upload.find({});
        
        for(image of images) {
            const getObjectParams = {
                Bucket: bucketname,
                Key: image.imageName,
            }
            const command = new GetObjectCommand(getObjectParams);
            const url = await getSignedUrl(s3, command, { expiresIn: 36000 });
            if(url) image.imageName = url
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