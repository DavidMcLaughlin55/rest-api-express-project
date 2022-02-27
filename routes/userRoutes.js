const express = require('express');
const { asyncHandler } = require('../middleware/async-handler');
const User = require('../models').User;
const router = express.Router();

// GETs all properties and values for the authenticated user. HTTP Status 200.
router.get('/users', asyncHandler(async (req, res) => {
    const users = await User.findAll();
    res.status(200).json(users);
}))

// POSTs newly created user to users. HTTP Status 201.
router.post('/users', asyncHandler(async (req, res) => {
    const newUser = await User.create(req.body);
    res.status(201).json({ message: 'New user has been created!' });
}))

module.exports = router;