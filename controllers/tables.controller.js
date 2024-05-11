const Tables = require("../models/tables.model");

const getAllTables = async (req, res) => {
  try {
    const products = await Tables.find({});
    console.log('Table', products);
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getTable = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Tables.findById(id);
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createTable = async (req, res) => {
  try {
    const product = await Tables.create(req.body);
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateTable = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Tables.findByIdAndUpdate(id, req.body);

    if (!product) {
      return res.status(404).json({ message: "Table with this ID is not found" });
    }

    const updatedProduct = await Tables.findById(id);
    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteTable = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Tables.findByIdAndDelete(id);

    if (!product) {
      return res.status(404).json({ message: "Table does not exist" });
    }

    res.status(200).json({ message: "Table deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllTables,
  getTable,
  createTable,
  updateTable,
  deleteTable,
};