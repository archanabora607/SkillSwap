require('dotenv').config();
const http = require('http');
const { Server } = require('socket.io');
const app = require('./app');
const connectDB = require('./config/db');
const { setupSocket } = require('./sockets/socket.handler');

const PORT = process.env.PORT || 5000;

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// Make io accessible in Express controllers via app.set
app.set('io', io);

// Setup socket events
setupSocket(io);

// Connect to MongoDB Atlas and start server
connectDB().then(() => {
  server.listen(PORT, () => {
    console.log(`🚀 Knowvia Server running on port ${PORT}`);
    console.log(`📡 Socket.IO ready`);
    console.log(`🌐 Environment: ${process.env.NODE_ENV}`);
  });
});
