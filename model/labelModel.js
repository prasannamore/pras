/*************************************************************************  
* @Execution : default node : cmd> server.js
* 
* 
* @Purpose : To create mongoose schema for labels in fundoo notes
* 
* @description : mongoose schema for labels in fundoo notes
* 
* @overview : fundoo application
* @author : Prasanna More <prasannamore.494@gmail.com>
* @version : 1.0
* @since : 27-april-2019
*
******************************************************************************/

var Mongoose = require("mongoose");

let Schema = Mongoose.Schema;

var labelSchema = Schema({
    UserID: {
        type: Schema.Types.ObjectId,
        ref: 'usermodels',
        require: true
    },
    labelName: {
        type: String,
        require: [true, 'labelName is required']
    }
},
    {
        timestamps: true
    })

var labelModel = Mongoose.model('labelModel', labelSchema);
module.exports = labelModel;