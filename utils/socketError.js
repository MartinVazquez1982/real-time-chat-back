import { logger } from './logger.js'

export const socketError = (socket, error) => {
  logger.info(error)
  socket.emit('errorOcurred', { message: error.message })
}
