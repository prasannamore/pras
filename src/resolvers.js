/*************************************************************************  
* @Execution : default node : cmd> server.js
* 
* 
* @Purpose : To Create resolvers
* 
* @description : Create resolvers
* 
* @overview : fundoo application
* @author : Prasanna More <prasannamore.494@gmail.com>
* @version : 1.0
* @since : 27-april-2019
*
******************************************************************************/

// require mongoose models
const userModel = require('../model/userModel')
const labelModel = require('../model/labelModel')
const notesModel = require('../model/notesModel')
const collaboraterModel = require('../model/collaborate')

// require mutation files
const registration = require('./mutations/user').registration;
const login = require('./mutations/user').login;
const verifyEmail = require('./mutations/user').verifyEmail;
const resetpassword = require('./mutations/user').resetpassword;
const forgotpassword = require('./mutations/user').forgotpassword;
const addLabel = require('./mutations/labels').addLabel;
const removeLabel = require('./mutations/labels').removeLabel;
const updateLable = require('./mutations/labels').updateLabel;
const addnote = require('./mutations/notes').addNotes;
const removenote = require('./mutations/notes').removeNote;
const editnote = require('./mutations/notes').editNote;
const addLabelToNote = require('./mutations/notes').addLabelToNote;
const removeLabelFromNote = require('./mutations/notes').removeLabelfromNote;
const trash = require('./mutations/notes').trash;
const archive = require('./mutations/notes').archive
const untrash = require('./mutations/notes').untrash;
const unarchive = require('./mutations/notes').unarchive;
const pullGitRepo = require('./mutations/notes').pullGitRepo;
const oAuth = require('./mutations/oAuth').oAuth;
const gitVerify = require('./mutations/oAuth').verify;
const addReminder = require("./mutations/notes").addReminder;
const AllUserCommits = require("./mutations/git").AllUserCommits;
const createIssue = require("./mutations/git").createIssue
const picUpload = require('./mutations/profileUpload').picUpload;
//const upload = require('../services/awsService').upload;
const createBranch = require('./mutations/git').createBranch;
const deleteBranch = require("./mutations/git").deleteBranch;
const star = require("./mutations/git").star;
const unstar = require("./mutations/git").unstar
const addCollaborator = require("./mutations/addCollaborator").addCollaborator
const removeCollaborator = require("./mutations/addCollaborator").removeCollaborator
const watchrepository = require("./mutations/git").watchrepository
const unwatchrepository = require("./mutations/git").unWatchRepository
//const { createApolloFetch } = require('apollo-fetch');


//require Query files
const Users = require("./Query/userQuery").User
const searchNoteByTittle = require("./Query/userQuery").searchNotesByTittle
const searchNotesByDescription = require("./Query/userQuery").searchNotesByDescription

// resolvers
exports.resolvers = {
    // Querys
    Query: {
        Users,
        searchNoteByTittle,
        searchNotesByDescription
    },
    // Mutations
    Mutation: {
        registration,
        login,
        verifyEmail,
        resetpassword,
        forgotpassword,
        addLabel,
        removeLabel,
        updateLable,
        addnote,
        removenote,
        editnote,
        oAuth,
        gitVerify,
        addLabelToNote,
        removeLabelFromNote,
        archive,
        trash,
        untrash,
        unarchive,
        pullGitRepo,
        addReminder,
        createBranch,
        deleteBranch,
        star,
        unstar,
        addCollaborator,
        removeCollaborator,
        watchrepository,
        unwatchrepository,
        AllUserCommits,
        createIssue
       
    },

    User: {
        async labels(root, args, context) {
            try {
                // read labels from redis cache
                var redislabel = await client.get("labels" + root._id)
                // if labels are available in redis cache return labels
                if (redislabel) {
                    var parsedlables = JSON.parse(redislabel)
                    var offset = args.offset || 0;
                    var first = args.first || parsedlables.length;
                    return parsedlables.slice(offset, offset + first)
                }
                // if not present in redis cache find from mongodb
                else {
                    var labels = await labelModel.find({ UserID: root._id })
                    client.set("labels" + root._id, JSON.stringify(labels))
                    var offset = args.offset || 0;
                    var first = args.first || labels.length;
                    return labels.slice(offset, offset + first)
                }

            }
            catch (err) {
                console.log(err)
                return {
                    "message": "error occured",
                    "success": false
                }
            }
        },
        async Notes(root, args, context) {
            try {
                // console.log(root)
                // find notes from mongodb
                var notes = await notesModel.find({ UserID: root._id }).populate("labelID").sort({ title: 1 })
                var offset = args.offset || 0;
                var first = args.first || notes.length;
                return notes.slice(offset, offset + first)
            }
            catch (err) {
                console.log(err)
                return {
                    "message": "error occured",
                    "success": false
                }
            }
        },
        async collabaratedNotes(root,args,context){
            try {
                //console.log(root)
                // find notes from mongodb
                var collaboratedNotes = await collaboraterModel.find({ collaboratorID: root._id }).populate("NoteID").sort({ title: 1 })
                var offset = args.offset || 0;
                var first = args.first || collaboratedNotes.length;
                //console.log("collaborataed notes   ",collaboratedNotes)
                return collaboratedNotes
            }
            catch (err) {
                console.log(err)
                return {
                    "message": "error occured",
                    "success": false
                }
            }
        }
    },

}

