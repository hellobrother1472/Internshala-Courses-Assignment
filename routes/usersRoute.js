const express = require('express');
const User = require('../models/user');
const Course = require('../models/course');
const router = express.Router();
const { body, validationResult } = require('express-validator');

router.post('/addUser', [
    body('name', 'Enter a valid name').isLength({ min: 3 }),
    body('email', 'Enter a valid email').isEmail()
], async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        let user = await User.findOne({ email: req.body.email });
        if (user) {
            return res.status(400).json({ error: "Sorry a user with this email already exists" })
        }

        user = await User.create({
            name: req.body.name,
            contact: req.body.contact,
            email: req.body.email,
        });

        res.send(user);

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})


router.get('/getUser', async (req, res) => {
    try {
        let user = await User.find();
        res.send(user)
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});


router.post('/enroll/:id', async (req, res) => {
    // getting id and email from user
    let courseId = req.params.id;
    let userEmail = req.body.email;


    // Finding user and course
    let user = await User.findOne({ email: userEmail });
    if (!user) {
        return res.send("User is not registered")
    }

    // Assigning some variables
    let userId = user._id;
    let previousCourses = user.enrolledCourses;
    let flag = false;
    let dateFlag = false;
    
    let course = await Course.findById(courseId);    
    let courseEnroll = await Course.findByIdAndUpdate(courseId, {
        enrolledStudents: [...course.enrolledStudents, userId]
    })
        
    // Checking for duplicates enrollments
    previousCourses.forEach(element => {
        if (element.toString() === course.title.toString()) {
            flag = true;
        }
    });

    let now = Date.now();
    console.log(now);
    console.log(Date.parse(course.start_date));

    // Checking for dates
    if (Date.parse(course.start_date) < now) {
        dateFlag = true;
    }

    if (dateFlag === true) {
        dateFlag = false;
        return res.send("You are late")
    }

    if (flag === false) {
        let userEnroll = await User.findByIdAndUpdate(userId, {
            enrolledCourses: [...user.enrolledCourses, course.title]
        })
        let updatedUser = await User.findOne({ email: userEmail });

        return await res.send(updatedUser);
    } else {
        flag = false;
        return res.send("You are already enrolled in this course")
    }

})

router.get("/enrollCoursesList", async (req, res) => {
    const userEmail = req.body.email;
    let user = await User.findOne({ email: userEmail });
    if (!user) {
        return res.send("User is not registered")
    }

    res.send(user.enrolledCourses);
});

module.exports = router;


