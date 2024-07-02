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
}
