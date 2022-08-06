const express = require('express');
const Course = require('../models/course');
const User = require('../models/course');
const router = express.Router();
const { body, validationResult } = require('express-validator');


router.post('/addCourse', [
    body('title', 'Title length must be greater than 2').isLength({ min: 3 }),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        let course = await Course.findOne({ title: req.body.title });
        if (course) {
            return res.status(400).json({ error: "Sorry a course with this title already exists" })
        }
        const start_date = new Date(req.body.start_date);
        const end_date = new Date(req.body.end_date);


        if (start_date.toString() === "Invalid Date" || end_date.toString() === "Invalid Date") {

            return res.send("Enter a valid date");
        }

        if (Date.parse(start_date) < Date.parse(end_date)) {
            course = await Course.create({
                title: req.body.title,
                description: req.body.description,
                start_date: start_date,
                end_date: end_date
            });
        } else {
            return res.send("End date cant be earlier than start date")
        }
        res.send(course);


    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})

router.get('/getCourse', async (req, res) => {
    try {
        let course = await Course.find();
        res.send(course)
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});

router.get("/enrollUserList", async (req, res) => {
    const courseTitle = req.body.title;
    let course = await User.findOne({ title: courseTitle });
    if (!course) {
        return res.send("User is not registered")
    }

    res.send(course.enrolledStudents);
});


module.exports = router;