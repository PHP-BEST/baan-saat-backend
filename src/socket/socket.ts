import { Server } from 'socket.io';
import http from 'http';
import express from 'express';
import { clientUrl } from '../configs';

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: clientUrl,
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

io.on('connection', (socket) => {
  socket.on('join_room', (room) => {
    socket.join(room);
  });

  socket.on('leave_room', (room) => {
    socket.leave(room);
  });

  socket.on('message', (message) => {
    io.to(message.room).emit('message', message);
  });

  socket.on('disconnect', () => {});
});

export { app, server, io };
