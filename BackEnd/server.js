import bodyParser from "body-parser";
import express, { response } from "express";
import path from "path";
import https from "https";
import fs from "fs";
import mime from "mime";
import { dirname } from "path";
import { fileURLToPath } from "url";

const app = express();
const options = {
  key: fs.readFileSync(
    "/etc/letsencrypt/live/y3hqfr.myvserver.online/privkey.pem"
  ),
  cert: fs.readFileSync(
    "/etc/letsencrypt/live/y3hqfr.myvserver.online/fullchain.pem"
  ),
};

const PORT = 443;
const __dirname = dirname(fileURLToPath(import.meta.url));

app.use(express.static(path.join(__dirname, 'public'), {
  setHeaders: (res, filePath) => {
      res.setHeader('Content-Type', mime.getType(filePath) || 'text/plain');
  },
}));
app.use(bodyParser.json());
app.use(express.static("../frontend"));

app.get("/", (req, res) => {
  res.status(200).sendFile(path.join(__dirname, "../frontend/login.html"));
});

const server = https.createServer(options, app);

server.listen(PORT, () => {
  console.log(`Server running on https://y3hqfr.myvserver.online:${PORT}`);
});
