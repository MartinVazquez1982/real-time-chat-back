import { ClientError } from './errors.js'

export const originFunction = (origin, callback) => {
  const allowedOrigin = ['http://localhost:5173', 'http://localhost:8080']
  if (allowedOrigin.indexOf(origin) !== -1 || !origin) {
    callback(null, true)
  } else {
    callback(new ClientError('Not allowed by CORS', 403))
  }
}
