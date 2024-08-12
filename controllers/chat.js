import { ChatModel } from '../models/chat.js'
import { ClientError, ServerError } from '../utils/errors.js'
import { validateMessage } from '../schemas/message.js'
import { socketError } from '../utils/socketError.js'

export class Chat {
  static async contact (req, res, next) {
    try {
      const contact = await ChatModel.contact(req.session.user.id)
      res.json(contact)
    } catch (e) {
      next(new ServerError('Error getting contacts', e.stack))
    }
  }

  static async getMessages (req, res, next) {
    const { to } = req.params
    try {
      const messages = await ChatModel.getMessages(req.session.user.id, to)
      res.json(messages)
    } catch (e) {
      if (e instanceof ClientError) {
        next(e)
      }
      next(new ServerError(`Error getting messages ${to}`, e.stack))
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
      const result = validateMessage({
        message,
        date,
        from: fromID,
        to
      })
      if (result.error) {
        throw new ClientError(result.error.issues.map(item => item.message).join(' - '))
      }
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
    } catch (error) {
      socketError(fromSocket, error)
    }
  }
}
