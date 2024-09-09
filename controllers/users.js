// import jwt from 'jsonwebtoken'
import { UserModel } from '../models/users.js'
import { validateUser } from '../schemas/users.js'
import jwt from 'jsonwebtoken'
import { ClientError, ServerError } from '../utils/errors.js'

export class Users {
  static async register (req, res, next) {
    try {
      const result = validateUser(req.body)
      if (result.error) {
        throw new ClientError(result.error.issues.map(item => item.message).join(' | '))
      }
      const {
        username,
        password,
        email
      } = result.data
      const response = await UserModel.register({ newUser: { username, password, email } })
      res.send({ status: 200 }).json(response)
    } catch (error) {
      next(error)
    }
  }

  static async login (req, res, next) {
    const { username, password } = req.body
    try {
      const user = await UserModel.login({ User: { username, password } })
      const token = jwt.sign(
        { id: user.id, username: user.username },
        process.env.JWT_SECRET_KEY,
        {
          expiresIn: process.env.JWT_EXPIRATION
        }
      )
      res.cookie('access_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // True la cookie solo se accede en https
        maxAge: 1000 * 60 * 60 // La cookie solo vale una hora
      }).send({ status: 200, user })
    } catch (error) {
      console.error(error)
      if (error instanceof ClientError) {
        next(error)
      }
      next(new ServerError('Error during login', error))
    }
  }

  static async logout (req, res) {
    res.status(200).clearCookie('access_token').json({ message: 'logout succesful' })
  }
}
