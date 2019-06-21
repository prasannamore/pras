const { gql } = require('apollo-server');

const typeDefs = gql`
type User {
    _id : ID!
    firstname : String!
    lastname : String!
    email : String!
    password : String!
    profileUrl : String!
    message : String!
    Notes(first:Int,offset:Int) :  [notes]
    labels(first:Int,offset:Int) : [label]
    collabaratedNotes(first:Int,offset:Int):[collaboratedNotes]

 }
  type repo {
      isPrivate : Boolean
      name : String
  }
 type Auth {
     message : String,
     token : String,
     success : Boolean!
     repo : [repo]
 }
 type label{
     _id : String!
     labelName : String!
 }

 type notes{
     title: String!
     discription : String
     labelID : [label]
 }
  type collaboratedNotes{
      NoteID:notes
  }
 
 type Query {
     Users :[User]
     searchNoteByTittle(title:String!):[notes]
     searchNotesByDescription(description:String!):[notes]
 }
 
 type UserCommites {
    repositoryCount : Int!
    edges:[edges]
 }
 type edges {
     node : node
 }

 type node {
     name:String
    commitComments:commitComments
 }
 type commitComments {
    totalCount:Int!
     nodes:[nodes]
 }

 type nodes {
    commit : commitUrl
 }
 type commitUrl {
    commitUrl:String
 }


 
 type Mutation{
    registration(firstname: String!,lastname: String!,email: String!, password: String!):Auth
    login(email:String!,password:String!):Auth
    verifyEmail:Auth
    resetpassword(confirmpassword:String!,password:String!):Auth
    forgotpassword(email:String!):Auth
    addLabel(labelName:String!):Auth
    removeLabel(labelID:String!):Auth
    updateLable(labelID:String!,newlabelName:String!):Auth
    addnote(title:String,discription:String!):Auth
    removenote(NoteID:String!):Auth
    editnote(NoteID:String!,title:String,discription:String!):Auth
    oAuth:Auth
    gitVerify:Auth
    addLabelToNote(labelID:String!,NoteID:String!):Auth
    removeLabelFromNote(labelID:String!,NoteID:String!):Auth
    archive(NoteID:String!):Auth
    trash(NoteID:String!):Auth
    unarchive(NoteID:String!):Auth
    untrash(NoteID:String!):Auth
    pullGitRepo:Auth
    addReminder(NoteID:String!,date:String!):Auth
    gitpullgraphql:Auth
    createBranch(gitUserName:String!,repoName:String!,branchName:String!):Auth
    deleteBranch(gitUserName:String!,repoName:String!,branchName:String):Auth
    star:Auth
    unstar:Auth
    watchrepository(watchrepository:String!,owner:String!):Auth
    unwatchrepository(unwatchrepository:String!,owner:String!):Auth
    addCollaborator(noteID:String!,collaborateID:String!):Auth
    removeCollaborator(noteID:String!,collaborateID:String!):Auth
    AllUserCommits:UserCommites  
    createIssue(repositoryId:String!,title:String!,assigneesIds:[String]):Auth
 }
`;

module.exports = { typeDefs };

