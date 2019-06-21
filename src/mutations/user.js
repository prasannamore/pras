/*************************************************************************  
* @Execution : default node : cmd> server.js
* 
* 
* @Purpose : To perform user mutations.
* 
* @description : login, registration, verifyemail, forgotpassword, resetpassword.
* 
* @overview : fundoo application
* @author : Prasanna More <prasannamore.494@gmail.com>
* @version : 1.0
* @since : 27-april-2019
*
******************************************************************************/

const userModel = require('../../model/userModel')
const labelModel = require('../../model/labelModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const sendMail = require('../../services/nodemailer').sendEmailFunction


/**
  * @description       : forgot password
  * @purpose           : send URL on email to reset password
  * @param {*} root    : result of previous resolve function
  * @param {*} args    : arguments for resolver funtions
  * @param {*} context    : context 
   */
exports.forgotpassword = async (parent, args, context) => {
    try {
        // check if user is registerd
        var user = await userModel.find({ 'email': args.email });
        console.log(user)
        if (user.length > 0) {
            // Send url with token for reseting password
            var  token = jwt.sign({ email: args.email }, process.env.APP_SECRET)
            var  url = ` click on url to reset password \n\n ${context.origin}/graphql?token=` + token;
            console.log("sdfsdfsf", url)
            // send mail for reset password
         sendMail(url, args.email)
            // return mail send messege
            return {
                "message": "mail send to email",
                "success": true
            }
        }
        return {
            "message": "Invalid user",
            "success": false
        }
    } catch (err) {
        console.log(err)
        return {
            "message": err,
            "success": false
        }
    }

}

/**
  * @description       : verify Email
  * @purpose           : verify email for registration
  * @param {*} root    : result of previous resolve function
  * @param {*} args    : arguments for resolver funtions
  * @param {*} context    : context 
   */
exports.verifyEmail = async (parent, args, context) => {
    try {
        console.log(context.token)
        // verify token
        let payload = await jwt.verify(context.token, "prasanna")
        // if token is verified set varification true
        var updateuser = await userModel.updateOne({ "email": payload.email }, { $set: { verified: true } })
        if (updateuser) {
            // return success message
            return {
                "message": "email verification sucessful",
                "success": true
            }
        }
        else {
            // return unsucess message
            return {
                "message": "email verification unsucessful",
                "success": true
            }
        }

    } catch (err) {
        console.log(err)
        return {
            "message": err,
            "success": false
        }
    }

}

/**
  * @description       : reset password
  * @purpose           : reset password
  * @param {*} root    : result of previous resolve function
  * @param {*} args    : arguments for resolver funtions
  * @param {*} context    : context 
   */
exports.resetpassword = async (parent, args, context) => {

    try {
        // check if password and confirmpassword match
        if (args.password !== args.confirmpassword) {
            return {
                "message": "password does not match",
                "success": false
            }
        }
        // check if password has min 8 length
        else if (args.password.length < 8) {
            return {
                "message": "password length should be min 8",
                "success": false
            }
        }
        console.log(context.token)
        // verify token
        let payload = await jwt.verify(context.token, process.env.APP_SECRET)
        //encrypt password
        var newpassword = bcrypt.hashSync(args.password, 10)
        // update password
        var updateuser = await userModel.updateOne({ "email": payload.email }, { $set: { password: newpassword } })
        if (updateuser)
            return {
                "message": "update sucessful",
                "success": true
            }
        else {
            return {
                "message": "update unsucessful",
                "success": true
            }
        }

    } catch (err) {
        console.log(err)
        return {
            "message": err,
            "success": false
        }
    }

}

/**
  * @description       : registration of user
  * @purpose           : register user
  * @param {*} root    : result of previous resolve function
  * @param {*} args    : arguments for resolver funtions
  * @param {*} context    : context 
   */

exports.registration = async (parent, args, context) => {

    try {
        // email validation
        var emailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
        if (!emailformat.test(args.email)) {
            return {
                "message": "not valid email",
                "success": false
            }
        }
        // password validation
        if (args.password.length < 8) {
            return {
                "message": "password must have atleast 8 char",
                "success": false
            }
        }
        // check if user exists
        var user = await userModel.find({ "email": args.email })

        if (user.length > 0) {
            return {
                "message": "email already exists",
                "success": false
            }
        }
        // encrypt password
        var hash = await bcrypt.hash(args.password, 10)

        var newUser = new userModel({
            "firstname": args.firstname,
            "lastname": args.lastname,
            "email": args.email,
            "password": hash,
            "verified": false
        })
        // save user 
        console.log(process.env.APP_SECRET)
        var saveuser = await newUser.save()
        var token = jwt.sign({ "email": args.email }, process.env.APP_SECRET);
        console.log(context.origin)
        var url = ` click on following link for email verification \n\n ${context.origin}/graphql?token=` + token;
        if (saveuser) {
            // send mail for email verification
            sendMail(url, args.email);
            return {
                "message": "Check yours mail for email verification",
                "success": true
            };
        }
        else {
            return {
                "message": "registration unsucess",
                "success": false
            }
        }
    }
    catch (err) {
        return {
            "message": err,
            "success": false
        }
    }

}

/**
  * @description       : login user
  * @purpose           : send token if user is login
  * @param {*} root    : result of previous resolve function
  * @param {*} args    : arguments for resolver funtions
  * @param {*} context    : context 
   */
exports.login = async (parent, args, context) => {
    try {
        // Email validation
        var emailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
        if (!emailformat.test(args.email)) {
            return {
                "message": "not valid email",
                "success": false
            }
        }
        // password verification
        if (args.password.length < 8) {
            return {
                "message": "password must have atleast 8 char",
                "success": false
            }
        }
        // check if user exists
        var user = await userModel.find({ "email": args.email })
        if (user.length > 0) {
            if (user[0].verified === false) {
                return {
                    "message": "email not varified",
                    "success": false
                }
            }
            // compare password
            var  valid = await bcrypt.compare(args.password, user[0].password)
            if (valid) {
                // Generate token
                var  token = jwt.sign({ "email": user[0].email, "user_ID": user[0].id }, process.env.APP_SECRET);
                //client.set("login_Token"+user[0]._id, token);
                var  labels = await labelModel.find({ UserID: user[0]._id }).populate("UserID")
                // console.log(labels)
                // add labels to redis
                await client.set("labels" + user[0]._id, JSON.stringify(labels))
                return {
                    "message": "login sucess",
                    "token": token,
                    "success": true
                }
            }
            else {
                return {
                    "message": "password not match",
                    "success": false
                }
            }
        }
        else {
            return {
                "message": "un auth",
                "success": false
            }
        }

    } catch (err) {
        console.log(err)
        return {
            "message": err,
            "success": false
        }
    }

}

