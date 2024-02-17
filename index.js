


const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
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

// Log the MongoDB URI to ensure it's correctly loaded from environment variables
console.log("MongoDB URI:", process.env.MONGODB_URI);

mongoose.connect(process.env.MONGODB_URI)
.then(() => {
  console.log("Connected to MongoDB");
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
})
.catch((error) => {
  console.error('Error connecting to the database', error);
});

/*
// Server-side code to handle typing indicators
socket.on('typing', (username) => {
  socket.broadcast.emit('user typing', username);
});

socket.on('stop typing', () => {
  socket.broadcast.emit('user stop typing');
});
*/


// Endpoint for joining the chat room
app.post('/join', authenticateToken, (req, res) => {
    res.send('Joined the chat room successfully');
  });
  
  // Endpoint for sending messages
  app.post('/send-message', authenticateToken, async (req, res) => {
    const { message } = req.body;
    try {
      const user = await User.findById(req.user.id);
      const newMessage = new Message({ user: user._id, content: message });
      await newMessage.save();
      io.emit('chat message', { username: user.username, message });
      res.send('Message sent successfully');
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal server error');
    }
  });
  
  // Endpoint for retrieving chat history
  app.get('/chat-history', authenticateToken, async (req, res) => {
    try {
      const chatHistory = await Message.find().populate('user', 'username').exec();
      res.json(chatHistory);
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal server error');
    }
  });
  
  // Express route for user registration
  app.post('/register', async (req, res) => {
    try {
      const { username, password } = req.body;
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return res.status(400).send('Username already exists');
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({ username, password: hashedPassword });
      await newUser.save();
      res.send('User registered successfully');
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal server error');
    }
  });
  
  // Express route for user login
  app.post('/login', async (req, res) => {
    try {
      const { username, password } = req.body;
      const user = await User.findOne({ username });
      if (!user) {
        return res.status(400).send('Invalid username or password');
      }
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(400).send('Invalid username or password');
      }
      const accessToken = jwt.sign({ id: user._id }, process.env.ACCESS_TOKEN_SECRET);
      res.json({ accessToken });
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal server error');
    }
  });
  
  
  
