import { checkSessionSocket } from './middlewares/check-sesion-socket.js'
import { Chat } from './controllers/chat.js'

const sockets = new Map()

export const setupSocket = (io) => {
  io.use(checkSessionSocket)

  io.on('connection', (socket) => {
    sockets.set(socket.session.user.username, socket)

    io.emit('user_connected', socket.session.user.username)

    socket.on('chat_message', async (msg, username, dateMsg) => {
      const toSocket = sockets.get(username) || null
      await Chat.sendMessage({
        message: msg,
        date: dateMsg,
        fromID: socket.session.user.id,
        fromUser: socket.session.user.username,
        to: username
      }, socket, toSocket)
    })

    socket.on('viewed', async (to) => {
      await Chat.viewedMessages({
        from: socket.session.user.id,
        to
      })
    })

    socket.on('user_connected', (user) => {
      const userConnected = sockets.has(user) ? user : ''
      socket.emit('user_connected', userConnected)
    })

    socket.on('disconnect', () => {
      sockets.delete(socket.session.user.username)
      io.emit('user_desconected', socket.session.user.username)
    })
  })
}
