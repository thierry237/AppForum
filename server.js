// Import express 
let express = require('express');

// Initialize the app 
let app = express();

app.use(express.json());

const cors = require('cors');
app.use(cors());

require('dotenv').config();

// Importing the database model
const Sequelize = require('sequelize');
const db = require('./db.js');

// Creating all the tables defined in agency
//db.sync()
db.sync({ alter: true }) //force : true

let router = require('./routes');
app.use("/", router);

// Manage bad route
app.use(function (req, res, next) {
    res.status(404).json({ "error": "path not found" });
});

// Launch app to listen to specified port
const port = process.env.PORT || 8000;
app.listen(port, function () {
    console.log('Runnings on ' + process.env.SERVER + port);
});