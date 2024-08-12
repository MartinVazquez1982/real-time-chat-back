import bcrypt from 'bcrypt'
import { connection } from '../db.js'
import { ClientError, ServerError } from '../utils/errors.js'

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
      const hashedPassword = await bcrypt.hash(password, parseInt(process.env.HASH_SALT_ROUND))
      await connection.query(
        'INSERT INTO USERTABLE (id, username, email, password) VALUES (UUID_TO_BIN(?),?,?,?)',
        [uuid, username, email, hashedPassword]
      )
    } catch (e) {
      if (e.code === 'ER_DUP_ENTRY') {
        throw new ClientError('username or email registered', 409)
      } else {
        throw new ServerError('Error creating a user', e.stack)
      }
    }
  }

  static async login ({ User }) {
    const {
      username,
      password
    } = User
    const [user] = await connection.query(
      'SELECT BIN_TO_UUID(USERTABLE.id) as id, username, password FROM USERTABLE WHERE username = ?',
      [username]
    )

    if (user.length === 0) {
      throw new ClientError(`The user ${username} does not exist`, 401)
    }
    const isValid = await bcrypt.compare(password, user[0].password)
    if (!isValid) throw new ClientError('Invalid password', 401)

    return {
      id: user[0].id,
      username: user[0].username
    }
  }
}
