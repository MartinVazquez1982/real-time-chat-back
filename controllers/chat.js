import { ChatModel } from '../models/chat.js'

export class Chat {
  static async contact (req, res) {
    try {
      const contact = await ChatModel.contact(req.session.user.id)
      res.json(contact)
    } catch {

    }
  }

  static async getMessages (req, res) {
    try {
      const { to } = req.params
      const messages = await ChatModel.getMessages(req.session.user.id, to)
      res.json(messages)
    } catch {

    }
  }

  static async sendMessage (data, fromSocket, toSocket) {
    try {
      const {
        message,
        date,
        fromID,
        fromUser,
        to
      } = data
      await ChatModel.AddMenssage({
        message,
        date,
        from: fromID,
        to
      })
      if (toSocket !== null) {
        toSocket.emit('chat_message', message, fromUser, to, date)
      }
      fromSocket.emit('chat_message', message, fromUser, to, date)
    } catch {

    }
  }
}
