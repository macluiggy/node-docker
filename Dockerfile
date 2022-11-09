FROM node:18
WORKDIR /app
COPY package.json ./

ARG NODE_ENV
RUN npm i -g pnpm
# RUN apk update
# RUN apk add
# RUN apt install redis-server
# RUN brew install redis
RUN if [ "$NODE_ENV" = "development" ];  \
          then pnpm install; \
          else pnpm install --only=production; \
    fi
COPY . ./
ENV PORT=3000
EXPOSE ${PORT}
CMD ["node", "index.js"]