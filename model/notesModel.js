/*************************************************************************  
* @Execution : default node : cmd> server.js
* 
* 
* @Purpose : To create mongoose schema for notes in fundoo notes
* 
* @description : mongoose schema for notes in fundoo notes
* 
* @overview : fundoo application
* @author : Prasanna More <prasannamore.494@gmail.com>
* @version : 1.0
* @since : 27-april-2019
*
******************************************************************************/
var Mongoose = require('mongoose');
let Schema = Mongoose.Schema;
var mongoosastic = require("mongoosastic")
var notesSchema = Schema({
    UserID: {
        type: Schema.Types.ObjectId,
        ref: 'usermodels'
    },
    labelID: [{
        type: Schema.Types.ObjectId,
        ref: 'labelModel'
    }],
    title: {
        type: String,
        require:[true,"title is required"]
    },
    discription: {
        type: String,
        require: [true,"discription is required"]
    },
    archive: {
        type: Boolean,
        default: false
    },
    remainder: {
        type: Date
    },
    trash:{
        type : Boolean,
        default :false
    }
},
    {
        timestamps: true
    })
// notesSchema.plugin(mongoosastic,{
//   hosts:[
//       'localhost:4000/graphql'
//   ]
// });
var notesModel = Mongoose.model('notesModel', notesSchema);

// notesModel.createMapping(function(err, mapping) {
//     if (err) {
//       console.log('error creating mapping (you can safely ignore this)');
//       console.log(err);
//     } else {
//       console.log('mapping created!');
//       console.log(mapping);
//     }
//   });
module.exports = notesModel;
