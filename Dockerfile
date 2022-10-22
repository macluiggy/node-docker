FROM node:18-alpine3.15
WORKDIR /app
COPY package.json ./

ARG NODE_ENV
RUN npm i -g pnpm
RUN if [ "$NODE_ENV" = "development" ];  \
          then pnpm install; \
          else pnpm install --only=production; \
    fi
COPY . ./
ENV PORT=3000
EXPOSE ${PORT}
CMD ["node", "index.js"]