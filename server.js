import express from 'express'
import { userRouter } from './routes/users.js'
import { chatRouter } from './routes/chat.js'
import { PORT } from './config.js'
import { checkSession } from './middlewares/check-sesion.js'
import cors from 'cors'
import cookieParser from 'cookie-parser'

const app = express()

app.disable('x-powered-by')

// Middlewares

app.use(express.json())
app.use(cookieParser())
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}))
app.use(checkSession)

// Routes

app.get('/', (req, res) => {
  res.send('Servidor de chat en tiempo real funcionando')
})

app.use('/auth', userRouter)
app.use('/chat', chatRouter)

app.listen(PORT, () => {
  console.log(`server listening on port: http://localhost:${PORT}`)
})
