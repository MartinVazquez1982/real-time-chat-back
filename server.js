import 'dotenv/config'
import express from 'express'
import http from 'http'
import { Server } from 'socket.io'
import { userRouter } from './routes/users.js'
import { chatRouter } from './routes/chat.js'
import { viewsRouter } from './routes/views.js'
import { checkSessionFetch } from './middlewares/check-sesion-fetch.js'
import { internalErrors } from './middlewares/internal-errors.js'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { setupSocket } from './socket.js'
import morgan from 'morgan'
import { connectToDatabase } from './database/db.js'
import { originFunction } from './utils/cors.js'

const app = express()
const server = http.createServer(app)
const io = new Server(server)

app.disable('x-powered-by')

// Connect to Database
connectToDatabase()

// Middlewares
app.use(express.json())
app.use(morgan('dev'))
app.use(cookieParser())
app.use(cors({
  origin: originFunction,
  credentials: true
}))

// Middleware session
app.use(checkSessionFetch)

// Routes
app.use('/', viewsRouter)
app.use('/auth', userRouter)
app.use('/chat', chatRouter)

// Middleware internal errors
app.use(internalErrors)

// Socket.io Setup
setupSocket(io)

// PORT Configuration
const port = process.env.PORT || 3000

server.listen(port, () => {
  console.log(`server listening on port: http://localhost:${port}`)
})
