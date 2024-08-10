// import jwt from 'jsonwebtoken'
import { UserModel } from '../models/users.js'
import { validateUser } from '../schemas/users.js'
import { SECRET_JWT_KEY } from '../config.js'
import jwt from 'jsonwebtoken'

export class Users {
  static async register (req, res) {
    const result = validateUser(req.body)
    if (result.error) {
      return res.status(400).json({ error: JSON.parse(result.error.message) })
    }
    try {
      const {
        username,
        password,
        email
      } = result.data
      const response = await UserModel.register({ newUser: { username, password, email } })
      res.send({ status: 200 }).json(response)
    } catch (error) {
      res.status(400).send(error.message)
    }
  }

  static async login (req, res) {
    const { username, password } = req.body
    try {
      const user = await UserModel.login({ User: { username, password } })
      const token = jwt.sign(
        { id: user.id, username: user.username },
        SECRET_JWT_KEY,
        {
          expiresIn: '1h'
        }
      )
      res.cookie('access_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // True la cookie solo se accede en https
        maxAge: 1000 * 60 * 60 // La cookie solo vale una hora
      }).send({ status: 200, user })
    } catch (error) {
      res.status(401).send(error.message)
    }
  }

  static async logout (req, res) {
    res.status(200).clearCookie('access_token').json({ message: 'logout succesful' })
  }
}
