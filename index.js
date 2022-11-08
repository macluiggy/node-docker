const mongoose = require("mongoose");
const express = require("express");
const {
  MONGO_USER,
  MONGO_PASSWORD,
  MONGO_IP,
  MONGO_PORT,
} = require("./config/config");

const postRouter = require("./routes/postRoutes");

const app = express();
app.use(express.json());

const mongoUrl =
  process.env.MONGO_URI ||
  `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_IP}:${MONGO_PORT}/?authSource=admin`;

// mongoose
//   .connect(
//     mongoUrl
//     //   {
//     //   useNewUrlParser: true,
//     //   useUnifiedTopology: true,
//     // }
//   )

//   .then(() => console.log("Connected to MongoDB"))
//   .catch((err) => console.log(err));

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

const NODE_ENV = process.env.NODE_ENV;
const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send(
    `<h1 style="color: red;">Hello World! you are in ${NODE_ENV} mode</h1>`
  );
});

app.use("/api/v1/posts", postRouter);

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
