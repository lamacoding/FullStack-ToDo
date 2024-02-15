import bodyParser from "body-parser";
import express, { response } from "express";
import path from "path";
// import https from "https";
// import fs from "fs";
// import mime from "mime";
import { dirname } from "path";
import { fileURLToPath } from "url";
import mysql from "mysql";

const app = express();
const dbConnection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "todo",
});
const query = "SELECT * FROM task WHERE userID = 1";

dbConnection.connect((err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("Connected to the database");
  }
});

// const options = {
//   key: fs.readFileSync(
//     "/etc/letsencrypt/live/y3hqfr.myvserver.online/privkey.pem"
//   ),
//   cert: fs.readFileSync(
//     "/etc/letsencrypt/live/y3hqfr.myvserver.online/fullchain.pem"
//   ),
// };

const PORT = 3000;
const __dirname = dirname(fileURLToPath(import.meta.url));

//app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(express.static("../FrontEnd"));

app.get("/", (req, res) => {
  res.status(200).sendFile(path.join(__dirname, "../FrontEnd/login.html"));
});

app.get("/todo", (req, res) => {
  res.status(200).sendFile(path.join(__dirname, "../FrontEnd/todo.html"));
  dbConnection.query(query, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      console.log(result);
    }
  });
});

process.on("beforeExit", () => {
  dbConnection.end();
  console.log("Database connection closed");
});
// const server = https.createServer(options, app);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
