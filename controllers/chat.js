import { ChatModel } from '../models/chat.js'

export class Chat {
  static async contact (req, res) {
    try {
      const contact = await ChatModel.contact(req.session.user.id)
      res.json(contact)
    } catch {

    }
  }
}
