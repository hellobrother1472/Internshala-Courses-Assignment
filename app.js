const express = require("express");
const mongoose = require("mongoose");
require('dotenv').config();
const bodyParser = require("body-parser");
const cors = require("cors");
const connectDB = require("./db/connection");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(express.json());
app.use(require("./routes/coursesRoute"));
app.use(require("./routes/usersRoute"));

connectDB();

app.listen(3000,()=>{
    console.log("The app is running on port 3000");
})