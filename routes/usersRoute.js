const express = require('express');
const User = require('../models/user');
const Course = require('../models/course');
const router = express.Router();
const { body, validationResult } = require('express-validator');
// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');
// var fetchuser = require('../middleware/fetchuser');
// const JWT_SECRET = 'Itmykartisagreat$organisation';

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
    // let obj = [];
    if (!user) {
        return res.send("User is not registered")
    }

    res.send(user.enrolledCourses);
});

module.exports = router;


















// router.post('/login', [
//     body('email', 'Enter a valid email').isEmail(),
//     body('password', 'Password cannot be blank').exists(),
// ], async (req, res) => {
//     let success = false;
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//         return res.status(400).json({ errors: errors.array() });
//     }

//     const { email, password } = req.body;
//     try {
//         let user = await User.findOne({ email });
//         if (!user) {
//             success = false
//             return res.status(400).json({ error: "Please try to login with correct credentials" });
//         }

//         const passwordCompare = await bcrypt.compare(password, user.password);
//         if (!passwordCompare) {
//             success = false
//             return res.status(400).json({ success, error: "Please try to login with correct credentials" });
//         }

//         const data = {
//             user: {
//                 id: user.id
//             }
//         }
//         const authtoken = jwt.sign(data, JWT_SECRET);
//         success = true;
//         res.json({ success, authtoken })

//     } catch (error) {
//         console.error(error.message);
//         res.status(500).send("Internal Server Error");
//     }


// });

// router.post('/signup', [
//     body('name', 'Enter a valid name').isLength({ min: 3 }),
//     body('email', 'Enter a valid email').isEmail(),
//     body('password', 'Password must be atleast 5 characters').isLength({ min: 5 }),
// ], async (req, res) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//         return res.status(400).json({ errors: errors.array() });
//     }
//     try {
//         // let success = false;
//         let user = await User.findOne({ email: req.body.email });
//         if (user) {
//             return res.status(400).json({ error: "Sorry a user with this email already exists" })
//         }
//         // const salt = await bcrypt.genSalt(10);
//         // const secPass = await bcrypt.hash(req.body.password, salt);

//         user = await User.create({
//             name: req.body.name,
//             contact: req.body.contact,
//             email: req.body.email,
//         });
//         // const data = {
//         //     user: {
//         //         id: user.id
//         //     }
//         // }

//         // success = true;
//         // const authtoken = jwt.sign(data, JWT_SECRET);
//         res.json({ success, authtoken })

//     } catch (error) {
//         console.error(error.message);
//         res.status(500).send("Internal Server Error");
//     }
// })