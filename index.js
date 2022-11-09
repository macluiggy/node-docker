//@ts-checkd

const mongoose = require("mongoose");
const express = require("express");
const session = require("express-session");
const Redis = require("ioredis")
const { createClient } = require("redis");

let RedisStore = require("connect-redis")(session);
const {
  MONGO_USER,
  MONGO_PASSWORD,
  MONGO_IP,
  MONGO_PORT,
  REDIS_URL,
  REDIS_PORT,
  SESSION_SECRET,
} = require("./config/config");

// let redisClient = redis.createClient({
//   // host: REDIS_URL,
//   // port: REDIS_PORT,
//   legacyMode: true
// })
let redisClient = createClient({
  legacyMode: true,
  host: REDIS_URL,
  port: REDIS_PORT,
});
// let redisClient = new Redis()
// redisClient.connect().catch(console.error);

const postRouter = require("./routes/postRoutes");
const userRouter = require("./routes/userRoutes");

const app = express();
app.use(express.json());

const mongoUrl =
  process.env.MONGO_URI ||
  `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_IP}:${MONGO_PORT}/?authSource=admin`;

const connectWithRetry = () => {
  console.log("MongoDB connection with retry");
  mongoose
    .connect(mongoUrl)
    .then(() => console.log("MongoDB is connected"))
    .catch((err) => {
      console.log(err);
      setTimeout(connectWithRetry, 5000);
    });
};

connectWithRetry();
app.use(
  session({
    store: new RedisStore({ client: redisClient }),
    secret: SESSION_SECRET,
    cookie: {
      secure: false,
      resave: false,
      saveUninitialized: false,
      httpOnly: true,
      maxAge: 30000,
    },
  })
);

const NODE_ENV = process.env.NODE_ENV;
const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send(
    `<h1 style="color: red;">Hello World! you are in ${NODE_ENV} mode</h1>`
  );
});

app.use("/api/v1/posts", postRouter);
app.use("/api/v1/users", userRouter);

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
