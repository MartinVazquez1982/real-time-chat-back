import jwt from 'jsonwebtoken'

const getCookie = (cookie, name) => {
  const value = `; ${cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) return parts.pop().split(';').shift()
}

export const checkSessionSocket = (socket, next) => {
  const token = getCookie(socket.handshake.headers.cookie, 'access_token')
  let data = null
  socket.session = { user: null }
  try {
    data = jwt.verify(token, process.env.JWT_SECRET_KEY)
    socket.session.user = data
  } catch {
    const error = new Error('Failed to authenticate token')
    error.data = { type: 'authentication_error', message: 'Failed to authenticate token' }
    return next(error)
  }
  next()
}
