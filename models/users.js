import bcrypt from 'bcrypt'
import { getConnection } from '../database/db.js'
import { ClientError, ServerError } from '../utils/errors.js'

export class UserModel {
  static async register ({ newUser }) {
    const {
      username,
      password,
      email
    } = newUser
    try {
      const connection = await getConnection()
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
        throw new ServerError('Error creating a user', e)
      }
    }
  }

  static async login ({ User }) {
    const {
      username,
      password
    } = User
    console.log('pase')
    const connection = await getConnection()
    console.log('pase - connection')
    const [user] = await connection.query(
      'SELECT BIN_TO_UUID(USERTABLE.id) as id, username, password FROM USERTABLE WHERE username = ?',
      [username]
    )
    console.log('pase - query')
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
