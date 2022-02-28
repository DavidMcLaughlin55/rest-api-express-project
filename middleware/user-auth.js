'use strict';

const basicAuth = require('basic-auth');
const bcrypt = require('bcryptjs');
const { User } = require('../models/user');

// authenticateUser is middleware used to authenticate the user request.
exports.authenticateUser = async (req, res, next) => {
    let message;

    const userCredentials = auth(req); // Parses user request credentials.

    if (userCredentials) {
        const user = await User.findOne({ where: { firstName: userCredentials.firstName } && { lastName: userCredentials.lastName } });
        if (user) {
            const authenticated = bcrypt.compareSync(userCredentials.password, user.password); // Compares user request password with stored user password.
            if (authenticated) {
                console.log(`User "${user.firstName} ${user.lastName}" has been authenticated.`);
                userCredentials = user;
            } else {
                message = `${user.firstName} ${user.lastName} could not be authenticated.`;
            }
        } else {
            message = `User could not be found for ${userCredentials.firstName} ${userCredentials.lastName}`;
        };
    } else {
        message = 'Auth header not found.';
    };

    if (message) {
        console.warn(message);
        res.status(401).json({ message: 'Access is denied.' });
    } else {
        next();
    }
};