import { getConnection } from '../database/db.js'
import { ClientError, ServerError } from '../utils/errors.js'

export class ChatModel {
  static async contact (userId) {
    const connection = await getConnection()
    const [contacts] = await connection.query(`
      SELECT 
        BIN_TO_UUID(user.id) as id, 
        user.username as username, 
        SUM(CASE WHEN msg.viewed = FALSE THEN 1 ELSE 0 END) as messagesPending, 
        COALESCE(MAX(msg.date_sent), '1970-01-01 00:00:00') AS lastMessageDate
      FROM USERTABLE as user 
      LEFT JOIN MESSAGE as msg ON (user.id = msg.user_id_from AND msg.user_id_to = UUID_TO_BIN(?)) 
      WHERE user.id != UUID_TO_BIN(?)
      GROUP BY user.id
      ORDER BY lastMessageDate DESC
      `, [userId, userId]
    )
    return contacts
  }

  static async getMessages (fromUser, toUser) {
    const [to] = await ChatModel.getIdUser(toUser)
    const connection = await getConnection()
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
      const connection = await getConnection()
      await connection.query(
        'INSERT INTO MESSAGE (message, date_sent, user_id_from, user_id_to, viewed) VALUES (?,?,UUID_TO_BIN(?),?, FALSE);',
        [message, date, from, toId.id]
      )
    } catch (e) {
      if (e instanceof ClientError) {
        throw e
      }
      throw new ServerError('Error storing message.', e)
    }
  }

  static async viewedMessages (conversation) {
    try {
      const {
        to,
        from
      } = conversation
      const [toId] = await ChatModel.getIdUser(to)
      const connection = await getConnection()
      await connection.query(`
        UPDATE MESSAGE
        SET viewed = TRUE
        WHERE user_id_from = ? AND user_id_to = UUID_TO_BIN(?) AND NOT viewed
        `, [toId.id, from]
      )
    } catch (e) {
      if (e instanceof ClientError) {
        throw e
      }
      throw new ServerError('Database error while updating message.', e)
    }
  }

  static async getIdUser (username) {
    const connection = await getConnection()
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
