const { createClient } = require('redis');
const client = createClient({
    url: 'redis://default:YBd1u4I7O2uf8NMRgQxey9I6J4t0C4sf@redis-13049.c283.us-east-1-4.ec2.redns.redis-cloud.com:13049'
});
client.on('error', (error) => console.log('Redis client error', error));
const connectionRedis = async () => {
    return client
        .connect()
        .then(() => console.log('Redis connected'))
        .catch((error) => console.log(error));
};
module.exports = {
    connectionRedis,
    redisClient: client
};
