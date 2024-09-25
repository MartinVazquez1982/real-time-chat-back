![imge](documentation/assets/readme.png)

## Index

1. [Index](#index)
2. [Description](#description)
3. [Features](#features)
4. [Technologies used](#technologies-used)
5. [Installation](#installation)
6. [Configuration](#configuration)

## Description

This repository provides the backend API for a real-time chat application, developed with Express and MySQL. It enables real-time messaging and user management, leveraging Socket.io for instant communication and MySQL for data persistence.

## Features
- Real-time messaging
- User authentication

## Technologies Used
- Node.js
- Express
- Socket.io
- MySQL

## Installation

Clone Repository:

```bash
git clone https://github.com/MartinVazquez1982/real-time-chat-back
cd real-time-chat-back
```

if using Docker:

Make sure you have Docker and Docker Compose installed on your machine.

```
docker-compose up
```

if installing manually:

- Make sure you have Node.js and npm installed, then run

```bash
npm install
```

- Set up the MySQL database:

```
mysql -u username -p chat_app < database/db.sql
```

## Configuration

Environment variables:

- Create a `.env` file in the project root and add your environment configuration:

```makefile
# Database configuration
DB_HOST= # Especifica la dirección del host de MySQL, por ejemplo, 'localhost' o la IP de tu servidor de base de datos.
DB_PORT=3306 # El puerto por defecto para MySQL es 3306. Si usas otro, cámbialo aquí.
DB_USER= # El nombre de usuario para conectarse a la base de datos.
DB_PASSWORD= # La contraseña del usuario de la base de datos.
DB_NAME='REALTIMECHAT' # El nombre de la base de datos donde se almacenará la información del chat.

# Server configuration
PORT= # El puerto en el que se ejecutará tu servidor Node.js (por ejemplo, 3000).
NODE_ENV='development' # Define el entorno de ejecución, puede ser 'development' o 'production'.

# Authentication
JWT_SECRET_KEY= # Una clave secreta para firmar los tokens JWT (puedes generar una clave segura).
JWT_EXPIRATION= # Duración del token JWT, por ejemplo, '1h' para 1 hora o '7d' para 7 días.
HASH_SALT_ROUND= # Número de rondas de sal para el hashing de contraseñas (por ejemplo, 10).
```

Run the application: 
- Once the .env file and database are configured, start the server

```bash
npm run dev
```