import express from 'express';
import { createServer } from 'http';
import path from 'path';
import { Server } from 'socket.io';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

const server = createServer(app);
const io = new Server(server);

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('sendLocation', function(data) {
        console.log(data);
        socket.emit('newLocation',{id: socket.id, ...data} );
    });
    
    socket.on('disconnect', function() {
        io.emit('user-disconnected', socket.id)
    });
});

app.get('/', (req, res) => {
    res.render('index'); // Assuming index.ejs is in the views folder
});

server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
