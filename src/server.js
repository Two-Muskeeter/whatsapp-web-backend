import express from 'express';
import cors from 'cors';
import morganBody from 'morgan-body';
import bodyParser from 'body-parser';
import fileUpload from 'express-fileupload';
import { fileURLToPath } from 'url';
import path from 'path';
import moment from 'moment';
import rfs from "rotating-file-stream";
import config from './config.js';
import v1 from './v1/routes/index.js'
import socketRoutes from './v1/routes/socketRoutes.js';
import { Server } from "socket.io";
import http from "http";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
app.use('*', cors())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: "50mb" }));
app.use(fileUpload());
v1(app)
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
    }
})
io.on("connection", (socket) => {
    socketRoutes(socket)
})
const fileName = `${moment().format('YYYY-MM-DD')}.log`;
const log = rfs.createStream(fileName, {
    interval: '1d', // rotate daily
    path: path.join(__dirname, 'log')
})

morganBody(app, {
    noColors: true,
    stream: log,
});


app.get("/", async (req, res) => {
    res.send(`<div align="center">APIs are up and running</div>`)
});

server.listen(config.PORT, () => {
    console.log(`Server running... on ${config.PORT}`)

})
