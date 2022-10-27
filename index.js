const app = require('express')();
const server = require('http').createServer(app);
const io = require('socket.io')(server, { cors: { origin: '*' }, path: "/api/socketio" });
const port = process.env.PORT || 4000;

io.on('connection', socket => {
  // your sockets here
  console.log('IO_CONNECTION');
  socket.on('user_join', async (userId) => {
    socket.join(userId);
    socket.join('global_room');
  });
  socket.on('new_conversation', (conversation) => {
    conversation?.Paticipants?.forEach(p => {
      socket.to(p.userId).emit('new_conversation', conversation)
    });
  });
  socket.on('send_message', async (msg) => {
    msg.conversation?.Paticipants?.forEach(p => {
      socket.to(p.userId).emit('new_message', msg)
    })
  });
  socket.on('typing', (msg) => {
  });
  socket.on('stop_typing', (msg) => {
  });
  io.on('disconnect', (user) => {
    console.log('disconnecting ');
    socket.leave(user?.id);
  })
});

server.listen(port, function() {
  console.log(`Listening on port ${port}`);
});