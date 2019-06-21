/*************************************************************************  
* @Execution : default node : cmd> server.js
* 
* 
* @Purpose : To perform connection  with mongodb
* 
* @description : connection with mongodb
* 
* @overview : fundoo application
* @author : Prasanna More <prasannamore.494@gmail.com>
* @version : 1.0
* @since : 27-april-2019
*
******************************************************************************/

const mongoose = require("mongoose");

function mongoConnect(){
   // connection to mongoose
   mongoose.connect(process.env.MONGOOSEURL,{ useNewUrlParser: true });
   // mongoose disconnected 
   mongoose.connection.on('disconnected',function(){
       console.log("connection to mongoose disconnected");
       process.exit();
   })
   // mongoose error
   mongoose.connection.on('error',function(err){
       console.log("Errr========>",err)
       process.exit();
   })
   mongoose.connection.on("connected", () => {
    console.log("Successfully connected to the database");
  })
   }
   module.exports ={
       mongoConnect
   }