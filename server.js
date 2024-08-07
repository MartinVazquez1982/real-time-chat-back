import express from 'express'
import http from 'http'
import { Server } from 'socket.io'
import { userRouter } from './routes/users.js'
import { chatRouter } from './routes/chat.js'
import { PORT } from './config.js'
import { checkSessionFetch } from './middlewares/check-sesion-fetch.js'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { setupSocket } from './socket.js'

const app = express()
const server = http.createServer(app)
const io = new Server(server)

app.disable('x-powered-by')

// Middlewares
app.use(express.json())
app.use(cookieParser())
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}))
app.use(checkSessionFetch)

// Routes
app.get('/', (req, res) => {
  res.send('Servidor de chat en tiempo real funcionando')
})

app.use('/auth', userRouter)
app.use('/chat', chatRouter)

// Socket.io Setup
setupSocket(io)

server.listen(PORT, () => {
  console.log(`server listening on port: http://localhost:${PORT}`)
})
