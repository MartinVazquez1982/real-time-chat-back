import mysql from 'mysql2/promise'

const config = {
  host: 'localhost',
  user: 'root',
  port: 3307,
  password: '12345',
  database: 'REALTIMECHAT'
}

export const connection = await mysql.createConnection(config)
