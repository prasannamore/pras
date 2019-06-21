/*************************************************************************  
* @Execution : default node : cmd> server.js
* 
* 
* @Purpose : To perform connection  with redis
* 
* @description : connection with redis
* 
* @overview : fundoo application
* @author : Prasanna More <prasannamore.494@gmail.com>
* @version : 1.0
* @since : 27-april-2019
*
******************************************************************************/

const redis = require("async-redis");
exports.redisConnection = function(){
client = redis.createClient();
client.on("connect",function(){
    console.log("****** redis connected  *******")
})
client.on("error",function(){
    console.log("****** error in redis connection *******")
    process.exit();
})
client.on("disconnect",function(){
    console.log("******* redis disconnected ********")
    process.exit();
})
}