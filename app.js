import express from 'express';
import { createServer } from 'http';
import path from 'path';
import { Server } from 'socket.io';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataFilePath = path.join(__dirname, '/visitor_data.json');

const app = express();
const PORT = 3000;

const server = createServer(app);
const io = new Server(server);

let visitors = {};

const loadVisitorData = () => {
    try {
        const data = fs.readFileSync(dataFilePath, 'utf8');
        visitors = JSON.parse(data);
    } catch (err) {
        console.error('Error reading visitor data file:', err);
        visitors = {};
    }
};

// Function to save visitor data to file
const saveVisitorData = () => {
// check the user id and if it is the same as the user id in the file, then update the location 
// if not, then add the user id and location to the file

fs.writeFile(dataFilePath, JSON.stringify(visitors, null, 2), (err) => {
    if (err) {
        console.error('Error saving visitor data:', err);
    } else {
        console.log('Visitor data saved successfully.');
    }
});
   
};

// Load existing visitor data on server start
loadVisitorData();

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', (socket) => {
    console.log('A user connected');

    // Emit stored visitor data to the new client upon connection
    // socket.emit('initialVisitors', Object.values(visitors));

    socket.on('sendLocation', (data) => {
        console.log('Received location:', data);

        // Store visitor data
        visitors[socket.id] = {
            id: socket.id,
            latitude: data.latitude,
            longitude: data.longitude
        };

        // Save updated visitor data to file
        saveVisitorData();

        // Broadcast new location to all clients
        io.emit('newLocation', {
            id: socket.id,
            latitude: data.latitude,
            longitude: data.longitude
        });
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');

        // Remove visitor data on disconnect
        delete visitors[socket.id];

        // Save updated visitor data to file
        saveVisitorData();

        // Broadcast user-disconnected event to all clients
        io.emit('user-disconnected', socket.id);
    });
});

app.get('/', (req, res) => {
    res.render('index'); // Assuming index.ejs is in the views folder
});

// Route to get all visitors data (example)
app.get('/visitors', (req, res) => {
    res.json(Object.values(visitors));
});

server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
