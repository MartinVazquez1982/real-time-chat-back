import { checkSessionSocket } from './middlewares/check-sesion-socket.js'
import { Chat } from './controllers/chat.js'

const sockets = new Map()

export const setupSocket = (io) => {
  io.use(checkSessionSocket)

  io.on('connection', (socket) => {
    if (sockets.has(socket.session.user.username)) {
      sockets.get(socket.session.user.username).push(socket)
    } else {
      sockets.set(socket.session.user.username, [socket])
    }

    io.emit('user_connected', socket.session.user.username)

    socket.on('chat_message', async (msg, username, dateMsg) => {
      const toSocket = sockets.get(username) || null
      const fromSocket = sockets.get(socket.session.user.username)
      await Chat.sendMessage({
        message: msg,
        date: dateMsg,
        fromID: socket.session.user.id,
        fromUser: socket.session.user.username,
        to: username
      }, fromSocket, toSocket, socket)
    })

    socket.on('viewed', async (to) => {
      await Chat.viewedMessages({
        from: socket.session.user.id,
        to
      }, socket)
    })

    socket.on('user_connected', (user) => {
      const userConnected = sockets.has(user) ? user : ''
      socket.emit('user_connected', userConnected)
    })

    socket.on('disconnect', () => {
      const userSocket = sockets.get(socket.session.user.username)
      const index = userSocket.indexOf(socket)
      userSocket.splice(index, 1)
      if (userSocket.length === 0) {
        sockets.delete(socket.session.user.username)
        io.emit('user_desconected', socket.session.user.username)
      }
    })
  })
}
