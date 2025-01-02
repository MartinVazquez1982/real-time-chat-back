import jwt from 'jsonwebtoken'
import { ClientError } from '../utils/errors.js'

const checkPath = (path) => {
  return (
    !path.startsWith('/auth') && path !== '/' && path !== '/docs'
  )
}

export const checkSessionFetch = (req, res, next) => {
  if (checkPath(req.path)) {
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
