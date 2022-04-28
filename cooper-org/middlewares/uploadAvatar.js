const path  = require('path')
const multer = require('multer')

//upload user profile avatar
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname,'../public/upload/users/'));
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, uniqueSuffix+""+path.extname(file.originalname))
    }
})
  
const upload = multer({storage});


module.exports = upload
