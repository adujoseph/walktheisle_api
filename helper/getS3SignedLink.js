const aws = require('aws-sdk')
require('dotenv').config()

const bucketname = process.env.S3_BUCKET_NAME
const bucketzone = process.env.S3_BUCKET_ZONE
const bucketkey = process.env.S3_ACCESS_KEY
const bucketsecret = process.env.S3_SECRET_KEY
const version = process.env.S3_SignatureVersion

aws.config.update({
    accessKeyId: bucketkey,
    secretAccessKey: bucketsecret,
    region: bucketzone,
    signatureVersion: version,
})


const getS3SignedLink = (key, bucket = bucketname)=>{
    const s3 = new aws.S3({})
    const signedUrlExpire = 60 * 60 //expire in one hour
    const params = {
        Bucket: bucket,
        Key: key,
        Expires: signedUrlExpire,
    }
    const signedUrl = s3.getSignedUrl('getObject',params)
    return signedUrl
}

module.exports = getS3SignedLink