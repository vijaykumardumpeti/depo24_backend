const mongoose = require('mongoose');

// MongoDB schema and model setup
const messageSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    content: String,
    timestamp: { type: Date, default: Date.now }
});

const Message = new mongoose.model('Message', messageSchema);

module.exports = Message