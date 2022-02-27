const express = require('express');
const { asyncHandler } = require('../middleware/async-handler');
const Course = require('../models').Course;
const router = express.Router();

// GETs all courses including user associated with each course. HTTP Status 200.
router.get('/courses', asyncHandler(async (req, res) => {
    const courses = await Course.findAll();
    res.status(200).json(courses);
}))

// GETs course corresponding to ID along with user associated with that course. HTTP Status 200.
router.get('/courses/:id', asyncHandler(async (req, res) => {
    const course = await Course.findByPk(req.params.id);
    res.status(200).json(course);
}))

// POSTs new course to courses. HTTP Status 201.
router.post('/courses', asyncHandler(async (req, res) => {
    const newCourse = await Course.create(req.body);
    res.status(201).json({ message: 'New course has been created!' });
}))

// PUTs course update for corresponding ID. HTTP Status 204.
router.put('/courses/:id', asyncHandler(async (req, res) => {
    const course = await Course.findByPk(req.params.id);
    res.status(204).json({ message: 'Course details updated!' })
}))

//DELETEs ID's corresponding course. HTTP Status 204.
router.delete('/courses/:id', asyncHandler(async (req, res) => {
    const course = await Course.findByPk(req.params.id);
    res.status(204).json({ message: 'Course has been deleted' });
}))

module.exports = router;