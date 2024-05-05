const express = require("express");
const router = express.Router();

const { getAllTables, getTable, createTable, updateTable, deleteTable } = require('../controllers/tables.controller.js');

/**
 * @swagger
 * /api/tables:
 *   post:
 *     summary: Create Table
 *     description: Register a new user with email, name, password, and phone number.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - alias
 *               - name
 *               - capacity
 *               - status
 *             properties:
 *               alias:
 *                 type: string
 *                 description: Numeric alias of table, e.g Table 1.
 *               name:
 *                 type: string
 *                 description: Identification tag for table.
 *               capacity:
 *                 type: number
 *                 description: Number of people that can be on a table.
 *               status:
 *                  type: boolean   
 *     tags:
 *       - Tables
 *     responses:
 *       201:
 *         description: Table created successfully.
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               description: Success message.
 *             tableId:
 *               type: integer
 *               description: The ID of the newly created table (optional).
 *       400:
 *         description: Bad request. Please ensure the request body is valid.
 *       409:
 *         description: Conflict. A table with the same name already exists.
 *       500:
 *         description: Internal server error.
 */
router.post("/", createTable);

/**
 * @swagger
 * /api/tables:
 *   get:
 *     summary: Get Tables
 *     description: Get the list of all tables at the event.
 *     tags:
 *       - Tables
 *     responses:
 *       201:
 *         description: Table created successfully.
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               description: Success message.
 *             tableId:
 *               type: string
 *               description: The ID of the newly created table (optional).
 *       400:
 *         description: Bad request. Please ensure the request body is valid.
 *       409:
 *         description: Conflict. A table with the same name already exists.
 *       500:
 *         description: Internal server error.
 */
router.get('/', getAllTables);


router.get("/:id", getTable);

/**
 * @swagger
 * /api/tables/{tableId}:
 *   put:
 *     summary: Update Table Details
 *     description: Modify details of an existing table.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: tableId
 *         type: string
 *         required: true
 *         description: The unique ID of the table to update.
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               alias:
 *                 type: string
 *                 description: Numeric alias of table (optional).
 *               name:
 *                 type: string
 *                 description: Identification tag for table (optional).
 *               capacity:
 *                 type: number
 *                 description: Number of people that can be on a table (optional).
 *               status:
 *                 type: string
 *                 description: Availability status of the table (e.g., available, reserved, occupied) (optional).
 *     tags:
 *       - Tables
 *     responses:
 *       200:
 *         description: Table details updated successfully.
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               description: Success message.
 *             table:  # Optional depending on your implementation
 *               type: object
 *               properties:
 *                 # Include properties of the updated table object
 *       400:
 *         description: Bad request. Invalid request body or table ID.
 *       401:
 *         description: Unauthorized. Missing or invalid JWT token.
 *       404:
 *         description: Not Found. Table with the specified ID does not exist.
 *       500:
 *         description: Internal server error.
 */
router.put("/:id", updateTable);


router.delete("/:id", deleteTable);


module.exports = router;


