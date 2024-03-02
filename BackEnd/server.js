import express from "express";
import path from "path";
// import https from "https";
// import fs from "fs";
// import mime from "mime";
import { dirname } from "path";
import { fileURLToPath } from "url";
import mysql from "mysql";
import md5 from "js-md5";

let userid = 0;

const app = express();
const dbConnection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "todo",
});

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
app.use(express.urlencoded());
app.use(express.json());
app.use(express.static("../FrontEnd"));



app.get("/", (req, res) => {
  userid = 0;
  res.status(200).sendFile(path.join(__dirname, "../FrontEnd/login.html"));
});

app.get("/register", (req, res) => {
  res.status(200).sendFile(path.join(__dirname, "../FrontEnd/register.html"));
});

app.post("/register", (req, res) => {
  if(typeof req.body.mail !== "string" || typeof req.body.password !== "string")
  {
    res.status(400).send("Error 400 - Bad request");
  }
  const query = "INSERT INTO user (mail, password) VALUES ('" + req.body.mail + "', '" + md5(req.body.password) + "')";
  dbConnection.query(query, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      console.log(result);
      res.status(200).sendFile(path.join(__dirname, "../FrontEnd/login.html"));
    }
  });
});

app.post("/login", (req, res) => {
  if(typeof req.body.mail !== "string" || typeof req.body.password !== "string")
  {
    res.status(400).send("Error 400 - Bad request");
  }
  const query = "SELECT * FROM user WHERE mail='" + req.body.mail + "' AND password='" + md5(req.body.password) + "'";
  dbConnection.query(query, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      console.log(result);
      if (result.length > 0) {
        userid = result[0].id;
        res.status(200).sendFile(path.join(__dirname, "../FrontEnd/task.html"));
      } else {
        res.status(401).sendFile(path.join(__dirname, "../FrontEnd/unauthorized.html"));
      }
    }
  });
});


app.get("/tasks", (req, res) => {
  const query = "SELECT * FROM task WHERE userid = " + userid + " ORDER BY id DESC";
  dbConnection.query(query, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      console.log(result);
      res.status(200).send(result);
    }
  });
});



app.post("/add", (req, res) => {
  const query = "INSERT INTO task (task, userid, done) VALUES ('" + req.body.task + "', " + userid + ", 0)";
  console.log("query: ", query);
  dbConnection.query(query, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      console.log(result);
      res.status(200).send(result);
    }
  });
});



app.delete("/delete/:id", (req, res) => {
  const query = "DELETE FROM task WHERE id = " + req.params.id;
  dbConnection.query(query, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      console.log(result);
      if (result[0])
        res.status(200).send(result);
    }
  });
});



app.put("/itemClicked/:id", (req, res) => {
  let newState = 0;
  const checkStateQuery = "SELECT done FROM task WHERE id = " + req.params.id;
  dbConnection.query(checkStateQuery, (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).send("Server error");
    } else {
      newState = result[0].done == 1 ? 0 : 1;

      const query = "UPDATE task SET done = " + newState + " WHERE id = " + req.params.id;
      dbConnection.query(query, (err, result) => {
        if (err) {
          console.log(err);
          res.status(500).send("Server error");
        } else {
          console.log(result);
          res.status(200).send("Task state updated");
        }
      });
    }
  });
});

app.put("/update/:id", (req, res) => {
  const query = "UPDATE task SET task = '" + req.body.task + "' WHERE id = " + req.params.id;
  dbConnection.query(query, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      console.log(result);
      res.status(200).send(result);
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
