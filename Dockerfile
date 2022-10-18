FROM node:18-alpine3.15

WORKDIR /app

COPY package.json ./

RUN npm install

COPY . ./
# RUN npm install
EXPOSE 3000

CMD ["npm", "run", "dev"]