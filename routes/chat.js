import { Router } from 'express'
import { Chat } from '../controllers/chat.js'

export const chatRouter = Router()

chatRouter.get('/contact', Chat.contact)

chatRouter.get('/messages/:to', Chat.getMessages)
