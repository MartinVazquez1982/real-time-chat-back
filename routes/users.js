import { Router } from 'express'
import { Users } from '../controllers/users.js'

export const userRouter = Router()

userRouter.post('/login', Users.login)

userRouter.post('/register', Users.register)

userRouter.post('/logout', Users.logout)
