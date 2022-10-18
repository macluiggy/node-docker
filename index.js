const express = require("express");

const app = express();

const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send('<h1 style="color: red;">Hello World!</h1>');
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
