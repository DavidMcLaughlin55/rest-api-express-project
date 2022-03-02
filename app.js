'use strict';

// Modules
const express = require('express');
const morgan = require('morgan');
const { sequelize } = require('./models');
const usersRoute = require('./routes/userRoutes');
const coursesRoute = require('./routes/courseRoutes');

// Variable to enable global error logging
const enableGlobalErrorLogging = process.env.ENABLE_GLOBAL_ERROR_LOGGING === 'true';

const app = express();

// Setup 
app.use(morgan('dev')); //Gives HTTP request logging
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routing
app.get('/', (req, res) => {
  res.json({
    message: 'REST API & Sequelize project',
  });
});
app.use('/api', usersRoute);
app.use('/api', coursesRoute);

// 404 Error Handler
app.use((req, res) => {
  res.status(404).json({
    message: 'Route Not Found',
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  if (enableGlobalErrorLogging) {
    console.error(`Global error handler: ${JSON.stringify(err.stack)}`);
  }

  res.status(err.status || 500).json({
    message: err.message,
    error: {},
  });
});

app.set('port', process.env.PORT || 5000);

// Test for database connection.
(async () => {
  // From Sequelize documentation
  try {
    // Test the connection to the database
    await sequelize.authenticate();
    console.log('Connection to the database successful!');
    // Sync the models
    await sequelize.sync();
    console.log('Synchronizing the models with the database...');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
})();

const server = app.listen(app.get('port'), () => {
  console.log(`Express server is listening on port ${server.address().port}`);
});
