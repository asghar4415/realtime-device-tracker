import express from 'express';
import { createServer } from 'http';
import path from 'path';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import connectMongoDB from "./connection.js";
import helmet from 'helmet';
import cors from 'cors';
import router from "./routes/route.js";
import jwt from 'jsonwebtoken';

const app = express();
const PORT = 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(cors());


connectMongoDB("realtime-location");

const server = createServer(app);
const io = new Server(server);


io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('sendLocation', (data) => {
        console.log('Received location:', data);


        io.emit('newLocation', {
            id: socket.id,
            latitude: data.latitude,
            longitude: data.longitude
        });
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');


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


app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
