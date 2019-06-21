/*************************************************************************  
* @Execution : default node : cmd> server.js
* 
* 
* @Purpose : To create mongoose schema for users in fundoo notes
* 
* @description : mongoose schema for users in fundoo notes
* 
* @overview : fundoo application
* @author : Prasanna More <prasannamore.494@gmail.com>
* @version : 1.0
* @since : 27-april-2019
*
******************************************************************************/

const mongoose = require('mongoose');
var schema = mongoose.Schema;
var userSchema = new schema({  // defining the mongodb schema

    firstname: {
        type: String,
    },
    lastname: {
        type: String,

    },
    email: {
        type: String,
        unique : [true, "email already exists"]

    },
    password: {
        type: String,

    },
    verified: {
        type : Boolean
    },
    gitVerify: {
        type: Boolean,
        default: false
    },
    gitid: {
        type: String
    },
    gitUsername: {
        type: String
    },
    gittoken: {
        type: String
    },
    imageUrl: {
        type: String
    }
},
    {
        timestamps: true
    });
module.exports = mongoose.model('usermodels', userSchema); // exporting the model