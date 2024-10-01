import jwt from 'jsonwebtoken'
import { ClientError } from '../utils/errors.js'

export const checkSessionFetch = (req, res, next) => {
  if (!req.path.startsWith('/auth') && req.path !== '/') {
    const token = req.cookies.access_token
    let data = null
    req.session = { user: null }
    try {
      data = jwt.verify(token, process.env.JWT_SECRET_KEY)
      req.session.user = data
    } catch {
      next(new ClientError('Access not authorized', 403))
    }
  }
  next()
}
