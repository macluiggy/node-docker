const express = require("express");

const app = express();
const NODE_ENV = process.env.NODE_ENV
const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send(`<h1 style="color: red;">Hello World! you are in ${NODE_ENV} mode</h1>`);
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
