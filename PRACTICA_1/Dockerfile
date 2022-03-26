FROM php:8.0-apache

RUN apt-get update && apt-get install -y nodejs npm

# Create app directory
WORKDIR /var/www/html

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY . .

EXPOSE 8080

CMD [ "node", "src/server.js" ]