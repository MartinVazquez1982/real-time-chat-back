import { connection } from '../db.js'
import { ClientError, ServerError } from '../utils/errors.js'

export class ChatModel {
  static async contact (userId) {
    const [contacts] = await connection.query(
      'SELECT BIN_TO_UUID(USERTABLE.id) as id, username FROM USERTABLE WHERE id != UUID_TO_BIN(?)',
      [userId]
    )
    return contacts
  }

  static async getMessages (fromUser, toUser) {
    const [to] = await ChatModel.getIdUser(toUser)
    const [messages] = await connection.query(`
      SELECT 
        message, 
        date_sent as date,
        IF (user_id_to = ?, TRUE, FALSE) as isMine 
      FROM MESSAGE 
      WHERE (user_id_from = UUID_TO_BIN(?) AND user_id_to = ?) OR (user_id_from = ? AND user_id_to = UUID_TO_BIN(?));
    `, [to.id, fromUser, to.id, to.id, fromUser])
    return messages
  }

  static async AddMenssage (newMessage) {
    const {
      message,
      date,
      from,
      to
    } = newMessage

    try {
      const [toId] = await ChatModel.getIdUser(to)
      await connection.query(
        'INSERT INTO MESSAGE (message, date_sent, user_id_from, user_id_to) VALUES (?,?,UUID_TO_BIN(?),?);',
        [message, date, from, toId.id]
      )
    } catch (e) {
      if (e instanceof ClientError) {
        throw e
      }
      throw new ServerError('Error storing message', e.stack)
    }
  }

  static async getIdUser (username) {
    const [id] = await connection.query(
      'SELECT id FROM USERTABLE WHERE username = ?',
      [username]
    )

    if (id.length === 0) {
      throw new ClientError('The user not exist', 409)
    }
    return id
  }
}
