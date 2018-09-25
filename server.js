'use strict';

const express = require('express');

const morgan = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');

// Create an Express application
const app = express(); 


app.use(morgan(process.env.NODE_ENV === 'development' ? 'dev' : 'common', {
  skip: () => process.env.NODE_ENV === 'test'
}));

// CORS
const corsOption = {
  origin: true,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  exposedHeaders: ['x-auth-token']
};
app.use(cors(corsOption));

// Parse request body
app.use(express.json());


app.get('/api/test', (req, res) => res.send('Hello World!'));


// Custom 404 Not Found route handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// Custom Error Handler
app.use((err, req, res, next) => {
  if (err.status) {
    const errBody = Object.assign({}, err, { message: err.message });
    res.status(err.status).json(errBody);
  } else {
    console.error(err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Connect to DB and Listen for incoming connections

app.listen(8082, () => console.log(`Example app listening on port ${8082}!`));

// if (process.env.NODE_ENV !== 'test') {
//   mongoose.connect(MONGODB_URI)
//     .then(instance => {
//       const conn = instance.connections[0];
//       console.info(`Connected to: mongodb://${conn.host}:${conn.port}/${conn.name}`);
//     })
//     .catch(err => {
//       console.error(`ERROR: ${err.message}`);
//       console.error('\n === Did you remember to start `mongod`? === \n');
//       console.error(err);
//     })
//     .then(() => {
//       app.listen(PORT, function () {
//         console.info(`Server listening on ${this.address().port}`);
//       }).on('error', err => {
//         console.error(err);
//       });
//     });
// }

module.exports = app; // Export for testing