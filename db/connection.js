const express = require("express"); // No need here
const mongoose = require("mongoose");

function connectDB() {
    mongoose.connect("mongodb+srv://"+process.env.DB_USER+":"+process.env.DB_PASS+"@cluster0.aen287c.mongodb.net/assignment").then(() => {
        console.log("database connected");
    }).catch((err) => {
        console.log(err);
    })
}

module.exports =  connectDB;