/*************************************************************************  
* @Execution : default node : cmd> server.js
* 
* 
* @Purpose : To create mongoose schema for collaborators
* 
* @description : mongoose schema for collaborators
* 
* @overview : fundoo application
* @author : Prasanna More <prasannamore.494@gmail.com>
* @version : 1.0
* @since : 27-april-2019
*
******************************************************************************/

var Mongoose = require("mongoose");

var Schema = Mongoose.Schema;

var collaboratorSchema = Schema({
    UserID: {
        type: Schema.Types.ObjectId,
        ref: 'usermodels'
    },
    NoteID: {
        type: Schema.Types.ObjectId,
        ref: 'notesModel'
    },
    collaboratorID: {
        type: Schema.Types.ObjectId,
        ref: 'usermodels'
    },

},
    {
        timestamps: true
    })
var colaborateModel = Mongoose.model('colModel', collaboratorSchema);
module.exports = colaborateModel;