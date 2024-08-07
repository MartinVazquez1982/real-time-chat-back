import { connection } from '../db.js'

export class ChatModel {
  static async contact (userId) {
    try {
      const [contacts] = await connection.query(
        'SELECT BIN_TO_UUID(USERTABLE.id) as id, username FROM USERTABLE WHERE id != UUID_TO_BIN(?)',
        [userId]
      )
      return contacts
    } catch (e) {

    }
  }

  static async getMessages (fromUser, toUser) {
    try {
      const to = await ChatModel.getIdUser(toUser)
      const [messages] = await connection.query(`
        SELECT 
          message, 
          date_sent as date,
          IF (user_id_to = ?, TRUE, FALSE) as isMine 
        FROM MESSAGE 
        WHERE (user_id_from = UUID_TO_BIN(?) AND user_id_to = ?) OR (user_id_from = ? AND user_id_to = UUID_TO_BIN(?));
      `, [to[0].id, fromUser, to[0].id, to[0].id, fromUser])
      return messages
    } catch (e) {
      console.log(e)
    }
  }

  static async AddMenssage (newMessage) {
    const {
      message,
      date,
      from,
      to
    } = newMessage

    try {
      const toId = await ChatModel.getIdUser(to)
      await connection.query(
        'INSERT INTO MESSAGE (message, date_sent, user_id_from, user_id_to) VALUES (?,?,UUID_TO_BIN(?),?);',
        [message, date, from, toId[0].id]
      )
    } catch (e) {
      console.log(e)
    }
  }

  static async getIdUser (username) {
    try {
      const [id] = await connection.query(
        'SELECT id FROM USERTABLE WHERE username = ?',
        [username]
      )

      if (id.length === 0) {
        throw new Error('El usuario emisor no existe')
      }
      return id
    } catch (e) {

    }
  }
}
