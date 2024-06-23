import express from 'express'
import { authRouter } from './routes/auth'
import { PORT } from './config'
import { checkSession } from './middlewares/check-sesion'

const app = express()

app.disable('x-powered-by')

// Middlewares

app.use(express.json())
app.use(checkSession)

// Routes

app.get('/', (req, res) => {
  res.send('Servidor de chat en tiempo real funcionando')
})

app.use('/auth', authRouter)

app.listen(PORT, () => {
  console.log(`server listening on port: http://localhost:${PORT}`)
})
