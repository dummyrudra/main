const Redis = require('redis');

const client = Redis.createClient();

//redis client connect 
client.on('connect', () => console.log('Redis Client Connected'));

// client.on('end', () =>{
//     console.log('Redis Client end the Connection');
// })
//redis client error 
client.on('error', async (err) =>{
    console.log('Redis Client Connection Error');
})  

module.exports=client