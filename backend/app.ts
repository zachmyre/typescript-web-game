import express from 'express';
import http from 'http';
import { Server, Socket } from 'socket.io';

const PORT: number = 3000;
const ioOptions: Partial<any> = {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    },
    pingTimeout: 3600000,
    transports: ['websocket', 'polling']
};

// Create an HTTP server
const app = express();
const server = http.createServer(app);
server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});

const players: any = {};

// Create a Socket.IO server instance
const io = new Server(server, ioOptions);

io.on("connection", (socket: Socket) => {
    console.log('connected');
    console.log(socket.id);

    // Send the player's own ID to them
    socket.emit("id", socket.id);

    if (!players[socket.id]) {
        players[socket.id] = { x: 5, y: 5, size: 1, name: "Zach" };
    }

    // Emit the updated player data to all clients except the player themselves
    const emitGameUpdate = () => {
        socket.broadcast.emit('game', players);
    };

    // Emit the initial game state to the newly connected player
    emitGameUpdate();

    socket.on('player', (playerData: any) => {
        players[playerData.id] = playerData.data;
        emitGameUpdate();
        console.log(players);
    });

    socket.on('disconnect', () => {
        if (players[socket.id]) {
            delete players[socket.id];
            emitGameUpdate();
        }
    });
});
