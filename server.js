import express from 'express'
import { userRouter } from './routes/users.js'
import { PORT } from './config.js'
import { checkSession } from './middlewares/check-sesion.js'

const app = express()

app.disable('x-powered-by')

// Middlewares

app.use(express.json())
app.use(checkSession)

// Routes

app.get('/', (req, res) => {
  res.send('Servidor de chat en tiempo real funcionando')
})

app.use('/auth', userRouter)

app.listen(PORT, () => {
  console.log(`server listening on port: http://localhost:${PORT}`)
})
