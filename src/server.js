import express from 'express';
// import redis from 'redis'
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
// const client = redis.createClient(
//     {
//         socket: {
//             host: '127.0.0.1',
//             port: '6379'
//         },
//     }
// )
// client['auth'] = null
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
app.use('*', cors())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: "50mb" }));
app.use(fileUpload());
v1(app)
const fileName = `${moment().format('YYYY-MM-DD')}.log`;
const log = rfs.createStream(fileName, {
    interval: '1d', // rotate daily
    path: path.join(__dirname, 'log')
})

morganBody(app, {
    noColors: true,
    stream: log,
});
app.get("/", (req, res) => {
    res.send(`<div align="center">APIs are up and running</div>`)
});
app.listen(config.PORT, () => {
    console.log(`Server running... on ${config.PORT}`)
});

// client.connect().catch(console.error)
// client.on("error", function (error) {
//     console.log("Error encountered", error)
// })

// client.on("connect", function (error) {
//     console.log("Redis Connection Established")
// })