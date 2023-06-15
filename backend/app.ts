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

// Create a Socket.IO server instance
const io = new Server(server, ioOptions);

  io.on("connection", (socket: Socket) => {
    console.log('connected');
    console.log(socket.id);
  
    // works when broadcast to all
    io.emit("noArg");
  
    // works when broadcasting to a room
    io.to("room1").emit("basicEmit", 1, "2", Buffer.from([3]));
  });


