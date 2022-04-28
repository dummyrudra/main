const messages=require('../messages.json')
const Joi = require("joi");

//pattern of password to must be 1 uppercase,1 lowercase,1 number,1 special symbol & length must be 7
const pattern =
/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*?&#._-])([a-zA-Z0-9@$!%*?&#._-]{7,})$/;

//validate user format before signup
exports.userValidateSignUp = (req, res, next) => {
  const schema = Joi.object({
    fullName: Joi.string().min(3).max(50).required().label("Full Name"),
    email: Joi.string().email().required().label("Email Address"),
    password: Joi.string().regex(pattern).required().label("Password"),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    //check if message from password field to send specific message
    if (
      error.message.indexOf(
        "fails to match the required pattern: /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*?&#._-])([a-zA-Z0-9@$!%*?&#._-]{7,})$/"
      ) > -1
    ) {
      return res
        .status(400)
        .send(messages.UserAPI.PASSWORD_FORMAT_MISMATCH);
    }
    return res.status(400).send({ message: error.details[0].message });
  } else {
    next();
  }
};

// exports.userValidateUpdate=(req,res,next)=>{
//     const schema=Joi.object({
//         fullName: Joi.string().min(3).max(50).required().label("Full Name"),
//         email:Joi.string().email().required().label('Email Address'),
//     })
//     const {error}=schema.validate(req.body)
//     if(error){
//         return res.status(400).send({message:error.details[0].message})
//     }else{
//         next()
//     }
// }
