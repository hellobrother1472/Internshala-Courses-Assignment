const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    contact: {
        type: String,
        required: true,
        unique : true
    },
    email: {
        type: String,
        required: true
    },
    enrolledCourses:[{
        type: String,
        ref:'Course'
    }]
});

const User = mongoose.model("User",userSchema);

module.exports = User;