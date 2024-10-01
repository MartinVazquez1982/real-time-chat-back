import { Router } from 'express'
import { Views } from '../controllers/views.js'

export const viewsRouter = Router()

viewsRouter.get('/', Views.home)
