var userModel = require('../../model/userModel')
var notesModel = require('../../model/notesModel')
var jwt = require("jsonwebtoken");
/**
  * @description       : get user
  * @param {*} root    : result of previous resolve function
  * @param {*} args    : arguments for resolver funtions
  * @param {*} context : context 
  */
exports.User = async (root, args, context) => {
    try {
        if (context.token) {
            var payload = await jwt.verify(context.token, process.env.APP_SECRET)
            if (payload) {
              var  user = await userModel.find({ _id: payload.user_ID })
                return user
            }
        }
        else {
            return {
                "message": "token not provided"
            }
        }
    }
    catch (err) {
        console.log(err)
        return {
            "message": "error occured",
            "success": false
        }
    }
}
exports.searchNotesByTittle = async (root, args, context) => {
    try {
        if (context.token) {
            var payload = await jwt.verify(context.token, process.env.APP_SECRET)
            var titleregex = new RegExp('^'+args.title)
            if (payload) {
               var notes = await notesModel.find({title: titleregex ,UserID:payload.user_ID })
               console.log(notes)
                return notes
            }
        }
        else {
            return {
                "message": "token not provided"
            }
        }
    }
    catch (err) {
        console.log(err)
        return {
            "message": "error occured",
            "success": false
        }
    }
}
exports.searchNotesByDescription = async (root, args, context) => {
    try {
        if (context.token) {
            var payload = await jwt.verify(context.token, process.env.APP_SECRET)
            var discriptionregex = new RegExp('^'+args.description)
            if (payload) {
                var  notes = await notesModel.find({discription: discriptionregex ,UserID:payload.user_ID })
                return notes
            }
        }
        else {
            return {
                "message": "token not provided"
            }
        }
    }
    catch (err) {
        console.log(err)
        return {
            "message": "error occured",
            "success": false
        }
    }
}

