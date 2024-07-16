import express from 'express';
import { createServer } from 'http';
import path from 'path';
import { Server } from 'socket.io';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import connectMongoDB from "./connection.js";
import helmet from 'helmet';
import cors from 'cors';
import router from "./routes/route.js";
import jwt from 'jsonwebtoken';
import { authenticateToken } from "./middleware/authMiddleware.js";

const app = express();
const PORT = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(cors());

// Connect to MongoDB
connectMongoDB("realtime-location");

const server = createServer(app);
const io = new Server(server);

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('sendLocation', (data) => {
        console.log('Received location:', data);

        // Broadcast new location to all clients
        io.emit('newLocation', {
            id: socket.id,
            latitude: data.latitude,
            longitude: data.longitude
        });
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');

        // Broadcast user-disconnected event to all clients
        io.emit('user-disconnected', socket.id);
    });
});


app.use("/", router);
io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) {
        return next(new Error('Authentication error'));
    }
    jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret', (err, user) => {
        if (err) {
            return next(new Error('Authentication error'));
        }
        socket.user = user;
        next();
    });
});


// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
