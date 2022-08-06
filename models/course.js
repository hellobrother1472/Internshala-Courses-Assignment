const mongoose = require("mongoose");

const courseSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true,
    },
    start_date: {
        type: String,
        required: true
    },
    end_date: {
        type: String,
        required: true
    },
    enrolledStudents:[ {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }]
});

courseSchema.methods.fn = async () => {
    return await start_date < end_date;
}

const Course = mongoose.model("Course", courseSchema);

module.exports = Course;