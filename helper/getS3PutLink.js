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

const getS3PutLink = (uniqueS3Key,mimeType,bucket = bucketname,region = bucketzone)=>{
    return new Promise(async(resolve, reject)=>{
        const options = {
            bucket : bucketname,
            region: bucketzone,
            signatureVersion: version,
            signatureExpires: 60, //number of seconds the link will be valid for... 60 is the default 
            ACL: 'private', //private is default
            uniquePrefix: true //true is default. If set to false, it will allow keys with the same name
        }
        const s3 = new aws.S3(options)
        const params = {
            Bucket: bucketname,
            Key: uniqueS3Key,
            Expires: 60, //in seconds
            ContentType: mimeType,
            ACL: 'private',
        }
        s3.getSignedUrl('putObject',params,(err,signedLink)=>{
            if(err)throw err // don't use this in production!
            console.log(signedLink)
            resolve(signedLink)
        })
    })
}

module.exports = getS3PutLink