import { checkSessionSocket } from './middlewares/check-sesion-socket.js'
import { Chat } from './controllers/chat.js'

/* Falta colocarle cuando se conecta un socket el username. Para luego buscar
ese usuario y enviarle el mensaje
*/

const sockets = {}

export const setupSocket = (io) => {
  io.use(checkSessionSocket)

  io.on('connection', (socket) => {
    sockets[socket.session.user.username] = socket

    socket.on('chat_message', async (msg, username, dateMsg) => {
      const toSocket = username in sockets ? sockets[username] : null
      Chat.sendMessage({
        message: msg,
        date: dateMsg,
        fromID: socket.session.user.id,
        fromUser: socket.session.user.username,
        to: username
      }, socket, toSocket)
    })

    socket.on('disconnect', () => {
      console.log('Usuario desconectado')
    })
  })
}
