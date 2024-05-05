const express = require("express");
const mongoose = require("mongoose");
const productRoute = require("./routes/product.route.js");
const tablesRoute = require("./routes/table.route.js");
const userRoute = require("./routes/user.route.js");
const uploadRoute = require('./routes/upload.route.js')
const swaggerUi = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');

require('dotenv').config()


const PORT = process.env.PORT || 4000
const DB_CONNECT = process.env.DB_CONNECT_STRING

const swaggerOptions = {
    swaggerDefinition: {
        openapi: "3.1.0",
        info: {
            title: 'WALK THE ISLE API',
            description: 'API Collections for Walk The Isle',
            version: '1.0.0',
            description:
                " A collection of wondefully crafted api for the event management app",
            license: {
                name: "MIT",
                url: "https://spdx.org/licenses/MIT.html",
            },
        },
        scheme:['http','https'],
        securityDefinitions: {
            bearerAuth: {
                type: 'apiKey',
                name: 'Authorization',
                scheme: 'bearer',
                in: 'header',
            },
        },
    },
    apis: ['./routes/*.js'], // Path to the API routes folder
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

const app = express();


// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs, { explorer: true }));


// routes
app.use("/api/products", productRoute);
app.use("/api/tables", tablesRoute);
app.use("/api/users", userRoute);
app.use("/api/uploads", uploadRoute);

mongoose
    .connect(DB_CONNECT)
    .then(() => {
        console.log("Connected to database!");
        app.listen(PORT, () => {
            console.log("Server is running on port", PORT);
        });
    })
    .catch(() => {
        console.log("Connection failed!");
    });