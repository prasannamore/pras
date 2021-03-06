/*************************************************************************  
* @Execution : default node : cmd> server.js
* 
* 
* @Purpose : To perform oAuth using git
* @description : Oauth using git and verify git.
* 
* @overview : fundoo application
* @author : Prasanna More <prasannamore.494@gmail.com>
* @version : 1.0
* @since : 27-april-2019
*
******************************************************************************/

const jwt = require("jsonwebtoken");
const userModel = require("../../model/userModel")
const axios = require("axios")
const sendMail = require("../../services/nodemailer").sendEmailFunction;
const axiosService = require("../../services/axiosService").axiosService;



/**
  * @description       : OAuth using github
  * @purpose           : register user using github
  * @param {*} root    : result of previous resolve function
  * @param {*} args    : arguments for resolver funtions
  * @param {*} context    : context 
   */


exports.oAuth = async (root, args, context) => {
    try {
        // check if code is provided
        if (!context.code) {
            throw new Error("code not provided")
        }
        // url for getting accesstoken
        var tokenurl = `${process.env.GITTOKEN}client_id=${process.env.CLIENT_ID}&client_secret=${process.env.CLIENT_SECRET}&code=${context.code}`

        // axios call for getting accesstoken
        const tokenresponse = await axiosService('POST', tokenurl)

        // access token in response
        let access_token = tokenresponse.data.access_token;

        // url for getting user info 
        var infourl = `${process.env.GITUSERDATA}${access_token}`

        // axios call for getting user info
        const response = await axiosService('GET', infourl, access_token)
        
        // check if user aleady present 
        var existuser = await userModel.find({ gitid: response.data.node_id })

        if (!existuser.length > 0) {
            // create new user
            var gituser = new userModel({ gittoken: access_token, firstname: response.data.login, gitid: response.data.node_id, email: response.data.email })
           
            // save new user
            var saveduser = await gituser.save()
            console.log(saveduser)
           
            // generate jwt token
            const token = jwt.sign({ gitid: response.id, "user_ID": saveduser._id, firstname: response.data.login }, process.env.APP_SECRET)
            const url = `${context.origin}/graphql?token=` + token;
            
            // send mail
            sendMail(url, response.data.email)
            return{
                "message":"OAuth successfull",
                "success":true
            }
        }
        else {
            return {
                "message": "already user",
                "success": true
            }
        }
    }
    catch (err) {
        console.log(err)
        return {
            "message": err.message,
            "success": false
        }
    }
}


/**
  * @description       : verify gitAccount
  * @purpose           : verify gitAccount
  * @param {*} root    : result of previous resolve function
  * @param {*} args    : arguments for resolver funtions
  * @param {*} context    : context 
   */
exports.verify = async (root, args, context) => {
    try {
        // check if token provided
        if (context.token) {
            // verify token
            var payload = await jwt.verify(context.token, process.env.APP_SECRET)
            if (payload) {
                console.log(payload)
                // check git user
                var verifygituser = await userModel.findByIdAndUpdate({ _id: payload.user_ID }, { $set: { gitVerify: true } })
                if (verifygituser) {
                    var gituser = await userModel.find({ _id: payload.user_ID })
                    console.log(gituser)
                    // set git verify true
                    if (gituser[0].gitVerify == true) {
                        return {
                            "message": "Git login success",
                            "success": true
                        }
                    }
                    // return git login unsucess
                    else {
                        return {
                            "message": "git login unsuccess",
                            "success": false
                        }
                    }
                }
            }
            else {
                // return token not vallid
                return {
                    "message": "UnAuth token not valid",
                    "success": false
                }
            }
        }
        return {
            "message": "UnAuth token not provided",
            "success": false
        }
    }
    catch (err) {
        console.log(err)
        return {
            "message": err,
            "success": false
        }
    }
}

