/*************************************************************************  
* @Execution : default node : cmd> server.js
* 
* 
* @Purpose : To create mongoose schema for issues in github
* 
* @description : mongoose schema for issues in github
* 
* @overview : fundoo application
* @author : Prasanna More <prasannamore.494@gmail.com>
* @version : 1.0
* @since : 27-april-2019
*
******************************************************************************/

const mongoose = require('mongoose')
const schema = mongoose.Schema;
const issueSchema = new schema({
issueGitId :{
type:String,
required:[true,'Issue Id is mandatory']
},
assigneeId : [{
type : String
}],
gitId : {
type:String,
//required:[true, 'GitId is mandatory']
}
},
{
timestamps : true
}
)

module.exports = mongoose.model('issues', issueSchema);