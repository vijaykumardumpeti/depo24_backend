
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
// const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

const Message = require('./schemas/messageSchema')
const User = require('./schemas/userSchema')
const authenticateToken = require('./authentication')

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.json());

// MongoDB setup
const PORT = process.env.PORT || 3001;
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
}) .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Error connecting to the database', error);
  });


