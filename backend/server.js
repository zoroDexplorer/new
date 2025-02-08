const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const router = require('../backend/src/routes/routes');

const app = express();

app.use(cors({
    origin: ["http://52.66.146.144"], // Update this later with frontend domain
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
  }));
app.use(express.json());

mongoose.connect("mongodb+srv://raviravi18425:raviravi18425@mysample.jydyc.mongodb.net/Image-Gallery").then(() => {
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.log('Error connecting to MongoDB', err);
});

app.use(router);

app.listen(5000, '0.0.0.0', () => {
    console.log("Server running on port 5000");
});