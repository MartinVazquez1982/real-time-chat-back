import bcrypt from 'bcrypt'
import { SALT_ROUND } from '../config.js'
import { connection } from '../db.js'

export class UserModel {
  static async register ({ newUser }) {
    const {
      username,
      password,
      email
    } = newUser
    try {
      const [uuidResult] = await connection.query('SELECT UUID() uuid;')
      const { uuid } = uuidResult[0]
      const hashedPassword = await bcrypt.hash(password, SALT_ROUND)
      await connection.query(
        'INSERT INTO USERTABLE (id, username, email, password) VALUES (UUID_TO_BIN(?),?,?,?)',
        [uuid, username, email, hashedPassword]
      )
    } catch (e) {
      if (e.code === 'ER_DUP_ENTRY') {
        throw new Error('El usuario ya se encuentra en la base de datos')
      } else {
        throw new Error(e)
      }
    }
  }

  static async login ({ User }) {
    const {
      username,
      password
    } = User
    try {
      const [user] = await connection.query(
        'SELECT BIN_TO_UUID(USERTABLE.id) as id, username, password FROM USERTABLE WHERE username = ?',
        [username]
      )

      if (user.length === 0) {
        throw new Error('El usuario no existe')
      }
      const isValid = await bcrypt.compare(password, user[0].password)
      if (!isValid) throw new Error('password invalida')

      return {
        id: user[0].id,
        username: user[0].username
      }
    } catch (e) {
      throw new Error(e)
    }
  }
}
