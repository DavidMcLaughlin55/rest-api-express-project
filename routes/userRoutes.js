'use strict';
//Imports
const express = require('express');
const bcrypt = require('bcryptjs');
const { authenticateUser } = require('../middleware/user-auth')
const { asyncHandler } = require('../middleware/async-handler');
const { User, Sequelize } = require('../models');
const router = express.Router();

// GETs all properties and values for the authenticated user. HTTP Status 200.
router.get('/users', authenticateUser, asyncHandler(async (req, res, next) => {
    const users = await User.findAll();
    if (users) {
        res.status(200).json(users);
    } else {
        next();
    }
}));

// POSTs newly created user to users. HTTP Status 201.
router.post('/users', asyncHandler(async (req, res, next) => {
    try {
        await User.create(req.body)
        res.status(201).end();
    } catch (error) {
        if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
            const errors = error.errors.map(err => err.message);
            res.status(400).json({ errors })
        } else {
            next();
        };
    };
}))

module.exports = router;