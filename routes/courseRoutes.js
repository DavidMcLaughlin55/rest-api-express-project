'use strict';
//Imports
const express = require('express');
const { authenticateUser } = require('../middleware/user-auth');
const { asyncHandler } = require('../middleware/async-handler');
const Course = require('../models').Course;
const router = express.Router();

// GETs all courses including user associated with each course. HTTP Status 200.
router.get('/courses', asyncHandler(async (req, res) => {
    const courses = await Course.findAll();
    if (courses) {
        res.status(200).json(courses);
    } else {
        next();
    }
}))

// GETs course corresponding to ID along with user associated with that course. HTTP Status 200.
router.get('/courses/:id', asyncHandler(async (req, res) => {
    const course = await Course.findByPk(req.params.id);
    if (course) {
        res.status(200).json(course);
    } else {
        next();
    }
}))

// POSTs new course to courses. HTTP Status 201.
router.post('/courses', authenticateUser, asyncHandler(async (req, res) => {
    const course = req.body;

    const courseErrors = [];

    if (!course.title) {
        courseErrors.push('Please provide a course title.');
    };

    if (!course.description) {
        courseErrors.push('Please provide a course description.');
    }

    if (courseErrors.length > 0) {
        res.status(400).json(courseErrors);
    } else {
        const newCourse = await Course.create(course);
        res.status(201).end();
    };
}));

// PUTs course update for corresponding ID. HTTP Status 204.
router.put('/courses/:id', authenticateUser, asyncHandler(async (req, res) => {
    let updatedCourse = req.body;

    updatedCourseErrors = [];

    if (!updatedCourse.title) {
        updatedCourseErrors.push('Please provide a course title.');
    };

    if (!updatedCourse.description) {
        updatedCourseErrors.push('Please provide a course description.');
    };

    if (updatedCourseErrors.length > 0) {
        res.status(400).json(updatedCourseErrors);
    } else {
        const course = await Course.findByPk(req.params.id);
        if (course) {
            course.update(updatedCourse);
        };
        res.status(204).end();
    };
}));

//DELETEs ID's corresponding course. HTTP Status 204.
router.delete('/courses/:id', authenticateUser, asyncHandler(async (req, res) => {
    const course = await Course.findByPk(req.params.id);
    res.status(204).end();
}));

module.exports = router;