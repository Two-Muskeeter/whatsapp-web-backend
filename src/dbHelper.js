import { resolve } from "path";
import redis from "redis";
import { promisify } from "util";

// create redis client
// const client = redis.createClient(
//     {
//         socket: {
//             host: 'oregon-redis.render.com',
//             port: '6379'
//         },
//     }
// )
const client = redis.createClient({
    host: 'oregon-redis.render.com',
    port: 6379,
    enableOfflineQueue: false,
    retry_strategy(options) {
        if (options.error && options.error.code === 'ECONNREFUSED') {
            return new Error('The server refused the connection');
        }
        if (options.total_retry_time > 1000 * 60 * 60) {
            return new Error('Retry time exhausted');
        }
        if (options.times_connected > 10) {
            return undefined;
        }
        return Math.max(options.attempt * 100, 3000);
    },
});
client.connect().catch(console.error);

export const setAsync = async (key, value) => {
    client.on('connect', () => {
        console.log('connected')
    })
    return new Promise((resolve, reject) => client.set(key, value, (err, reply) => {
        if (err) {
            reject(err)
        }
        console.log(err, reply)
        resolve(reply)
    }))
}

export const getAsync = async (key) => {
    client.on('connect', () => {
        console.log('connected')
    })
    return new Promise((resolve, reject) => client.get(key, (err, reply) => {
        if (err) {
            reject(err)
        }
        else{
            console.log(err, reply)
            resolve(reply)
        }
         }))
}

// export const connectAsync = promisify(client.connect).bind(client);
// export const getAsync = promisify(client.get).bind(client);
// export const setAsync = promisify(client.set).bind(client);
// export const delAsync = promisify(client.del).bind(client);
