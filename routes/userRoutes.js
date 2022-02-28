'use strict';
//Imports
const express = require('express');
const bcrypt = require('bcryptjs');
const { authenticateUser } = require('../middleware/user-auth')
const { asyncHandler } = require('../middleware/async-handler');
const User = require('../models').User;
const router = express.Router();

// GETs all properties and values for the authenticated user. HTTP Status 200.
router.get('/users', authenticateUser, asyncHandler(async (req, res) => {
    const users = await User.findAll();
    if (users) {
        res.status(200).json(users);
    } else {
        next();
    }
}));

// POSTs newly created user to users. HTTP Status 201.
router.post('/users', asyncHandler(async (req, res) => {
    const user = req.body;

    // User Validation
    const userErrors = [];

    if (!user.firstName) {
        userErrors.push('Please provide a first name.');
    };

    if (!user.lastName) {
        userErrors.push('Please provide a last name.');
    };

    if (!user.emailAddress) {
        userErrors.push('Please provide a valid email address');
    };

    if (!user.password) {
        userErrors.push('A password is required. Please provide a unique password');
    } else if (user.password.length < 10 || user.password.length > 20) {
        userErrors.push('Your password should be between 10 and 20 characters in length.');
    } else {
        user.password = bcrypt.hashSync(password, 10);
    };

    if (userErrors.length > 0) {
        res.status(400).json({ userErrors })
    } else {
        const newUser = await User.create(user);
        res.status(201).end();
    }
}))

module.exports = router;