import jwt from 'jsonwebtoken'

export const checkSessionFetch = (req, res, next) => {
  if (!req.path.startsWith('/auth')) {
    const token = req.cookies.access_token
    let data = null
    req.session = { user: null }
    try {
      data = jwt.verify(token, process.env.JWT_SECRET_KEY)
      req.session.user = data
    } catch {
      return res.status(403).json({ message: 'Access not authorized' })
    }
  }
  next()
}
