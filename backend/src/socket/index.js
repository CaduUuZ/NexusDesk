const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');

function setupSocket(server) {
  const io = new Server(server, { cors: { origin: '*' } });

  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) return next(new Error('Não autenticado'));
    try {
      socket.user = jwt.verify(token, process.env.JWT_SECRET);
      next();
    } catch {
      next(new Error('Token inválido'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`Socket conectado: ${socket.user.id}`);
    socket.join(`user:${socket.user.id}`);

    socket.on('join:ticket', (ticketId) => socket.join(`ticket:${ticketId}`));
    socket.on('leave:ticket', (ticketId) => socket.leave(`ticket:${ticketId}`));
    socket.on('disconnect', () => console.log(`Socket desconectado: ${socket.user.id}`));
  });

  global.io = io;
  return io;
}

function emitToTicket(ticketId, event, data) {
  if (global.io) global.io.to(`ticket:${ticketId}`).emit(event, data);
}

function emitToUser(userId, event, data) {
  if (global.io) global.io.to(`user:${userId}`).emit(event, data);
}

module.exports = { setupSocket, emitToTicket, emitToUser };
