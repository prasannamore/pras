/*************************************************************************  
* @Execution : default node : cmd> server.js
* 
* 
* @Purpose : To upload file on amazon s3
* 
* @description : uploading file on amazon s3
* 
* @overview : fundoo application
* @author : Prasanna More <prasannamore.494@gmail.com>
* @version : 1.0
* @since : 27-april-2019
*
******************************************************************************/


const path = require('path')
const aws = require('aws-sdk')
const multer = require('multer')
const multerS3 = require('multer-s3')
// create object of aws s3
const s3 = new aws.S3({
    region: 'ap-south-1',
    accessKeyId: process.env.ACESSKEYID,
    secretAccessKey: process.env.SECRETACESSKEY
})
// create upload funtion of multer
exports.upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: 'myfundoo',
        metadata: function (req, file, cb) {
            console.log(req)
            cb(null, { fieldName: file.originalname });
        },
        key: function (req, file, cb) {
            console.log(file)
            cb(null, Date.now().toString() + path.extname(file.originalname).toLowerCase())
        },
        fileFilter: function (req, file, cb) {
            checkFileType(file, cb);
        }
    })
})
// file filter
function checkFileType(file, cb) {
    // Allowed ext
    const filetypes = /jpeg|jpg|png|gif/;
    // Check ext
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // Check mime
    const mimetype = filetypes.test(file.mimetype);
    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb('Error: Images Only!');
    }
}
