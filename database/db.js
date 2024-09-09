import mysql from 'mysql2/promise'
import { ServerError } from '../utils/errors.js'

const config = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  port: process.env.DB_PORT,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
}

let connection
let isConnecting = false

export const connectToDatabase = async () => {
  if (isConnecting) return
  isConnecting = true

  while (!connection) {
    try {
      connection = await mysql.createConnection(config)

      connection.on('error', (err) => {
        console.error(err)
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
          connectToDatabase()
        } else {
          throw new ServerError('An issue occurred while processing your request. Please try again later.')
        }
      })
    } catch (err) {
      console.error(err)
      await new Promise(resolve => setTimeout(resolve, 5000))
    } finally {
      isConnecting = false
    }
  }
}

export const getConnection = async () => {
  if (!connection) {
    throw new ServerError('An issue occurred while processing your request. Please try again later.')
  }
  return connection
}
