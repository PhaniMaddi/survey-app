const express = require("express");
const path = require("path");

const app = express();
const port = process.env.PORT || "8000";

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "html");

app.use(express.static(__dirname + "/public"));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

app.post("/survey", (req, res) => {
  setTimeout(() => {
    res.sendStatus(200);
  }, 2000);
});

app.listen(port, (err) => {
  if (err) return console.error(err);
  return console.log(`Server is listening on ${port}`);
});
