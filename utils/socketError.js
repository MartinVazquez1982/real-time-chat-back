export const socketError = (socket, error) => {
  socket.emit('errorOcurred', { message: error.message })
}
