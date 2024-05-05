// const Upload = require("../models/tables.model")


const uploadImage = async (req, res) => {
    try {
       // console.log(req.body, req.file, req.file.buffer)
        res.status(200).json({message: 'image uploaded successfully'})
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getAllImages = async (req, res) => {
    try {
        res.status(200).json({message: 'image downloaded successfully'})
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getAllImages,
    uploadImage
};