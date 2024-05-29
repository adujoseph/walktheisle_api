const Upload = require("../models/upload.model")
const { S3Client, PutObjectCommand, GetObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
// const { randomImageName } = require('../helper/randomImageName');
const mime = require('mime-types');
const getS3SignedLink = require("../helper/getS3SignedLink");
const getS3PutLink = require("../helper/getS3PutLink");
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


const getPutLink = async (req,res) => {
    const { fileName, fileSize, fileType } = req.body
    const uniqueKeyName = `${Date.now().toString()}-${encodeURIComponent(fileName)}`
    const mimeType = mime.lookup(fileName)
    const signedLink = await getS3PutLink(uniqueKeyName,mimeType)
    res.json({
        signedLink,
        mimeType,
        uniqueKeyName
    })
}

const finalizeUpload = (req, res)=>{
    const { key } = req.body
    const signedLink = getS3SignedLink(key)
    res.json(signedLink) 
}


const uploadImage = async (req, res) => {
    console.log(req.file, req.body);
    const imageName = `${Date.now().toString()}-${encodeURIComponent(req.file.originalname)}`
    try {
        const params = {
            Bucket: bucketname,
            Key: imageName,
            Body: req.file.buffer,
            ContentType: req.file.mimetype
        }
        const command = new PutObjectCommand(params)
        await s3.send(command)
        const uploadUrl = `https://${bucketname}.s3.amazonaws.com/${imageName}`
        let data = {
            phone: req.body.phone,
            imageName: imageName,
            imageUrl: uploadUrl
        }
        const upload = await Upload.create(data);
        res.status(200).json({ data: upload, message: 'image uploaded successfully', uploadUrl })
    } catch (error) {
        res.status(500).json({ data: null, message: error.message });
    }
};


const getAllImages = async (req, res) => {
    try {
        const images = await Upload.find({});

        // for(image of images) {
        //     const getObjectParams = {
        //         Bucket: bucketname,
        //         Key: image.imageName,
        //     }
        //     console.log(getObjectParams)
        //     const command = new GetObjectCommand(getObjectParams);
        //     const url = await getSignedUrl(s3, command, { expiresIn: 3600 });
        //     if(url) image.imageName = url
        // }
        res.status(200).json({ data: images, message: "image fetched successfully" })
    } catch (error) {
        res.status(500).json({ data: null, message: error.message });
    }
};

module.exports = {
    getAllImages,
    uploadImage,
    getPutLink,
    finalizeUpload
};