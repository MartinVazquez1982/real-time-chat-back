# Node.js official image
FROM node:18-alpine

WORKDIR /usr/src/app

# Copia el archivo package.json y package-lock.json
COPY package*.json ./

# Instala las dependencias de la aplicación
RUN npm install --production

# Copia el resto de la aplicación al contenedor
COPY . .

# Expone el puerto en el que corre tu aplicación
EXPOSE 3000

# Comando para correr la aplicación
CMD ["npm", "run", "prod"]