'use strict';
// Imports
const express = require('express');
const { authenticateUser } = require('../middleware/user-auth');
const { asyncHandler } = require('../middleware/async-handler');
const { Course } = require('../models');
const { User } = require('../models');
const router = express.Router();

// GETs all courses including user associated with each course. HTTP Status 200.
router.get('/courses', asyncHandler(async (req, res, next) => {
    const courses = await Course.findAll({
        include: { model: User }
    });
    if (courses) {
        res.status(200).json(courses);
    } else {
        next();
    }
}))

// GETs course corresponding to ID along with user associated with that course. HTTP Status 200.
router.get('/courses/:id', asyncHandler(async (req, res, next) => {
    const course = await Course.findByPk(
        req.params.id,
        { include: { model: User } }
    );
    if (course) {
        res.status(200).json(course);
    } else {
        next();
    }
}))

// POSTs new course to courses. HTTP Status 201.
router.post('/courses', authenticateUser, asyncHandler(async (req, res, next) => {
    let course;
    try {
        course = await Course.create(req.body);
        res.status(201).location(`/courses/${course.id}`).end();
    } catch (error) {
        if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
            const errors = error.errors.map(err => err.message);
            res.status(400).json({ errors })
        } else {
            next();
        };
    };
}));

// PUTs course update for corresponding ID. HTTP Status 204.
router.put('/courses/:id', authenticateUser, asyncHandler(async (req, res, next) => {
    try {
        const course = await Course.findByPk(req.params.id);
        if (course) {
            await course.update(req.body);
            res.status(204).end();
        } else {
            next();
        };
    } catch (error) {
        if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
            const errors = error.errors.map(err => err.message);
            res.status(400).json({ errors })
        } else {
            next();
        };
    };
}));

//DELETEs ID's corresponding course. HTTP Status 204.
router.delete('/courses/:id', authenticateUser, asyncHandler(async (req, res, next) => {
    const course = await Course.findByPk(req.params.id);
    if (course) {
        course.destroy();
        res.status(204).end();
    } else {
        next();
    }
}));

module.exports = router;