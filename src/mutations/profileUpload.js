/*************************************************************************  
* @Execution : default node : cmd> server.js
* 
* 
* @Purpose : To upload profile pic
* 
* @description : upload profile pic on amozon s3.
* 
* @overview : fundoo application
* @author : Prasanna More <prasannamore.494@gmail.com>
* @version : 1.0
* @since : 27-april-2019
*
******************************************************************************/
const userModel = require('../../model/userModel');
const jwt = require('jsonwebtoken');
exports.picUpload = async (root,args,context)=>{
    if (context.token) {
      var payload = await jwt.verify(context.token, process.env.APP_SECRET)
      console.log(context.request);
      var updateurl = await userModel.findOneAndUpdate({ _id: payload.user_ID }, { $set: { imageurl: context.request.file.location } })
      if (updateurl) {
        return {
          profileUrl: context.request.file.location
        }
      }
    }
    else {
      return {
        profileUrl: "token not provided"
      }
    }
}