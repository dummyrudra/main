const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {AES , enc} = require('crypto-js');
const config = require('config')


//Encrypt the plan password to hash code
module.exports.hashPassword = async(password)=>{
    try{
        const salt = await bcrypt.genSalt(10)
        return await bcrypt.hash(password,salt);

    }catch(err){
        throw err
    }
}


//Compare the plan password to hash password
module.exports.validatePassword = async(password,hashPassword)=>{
    try{

        return await bcrypt.compare(password, hashPassword);

    }catch(err){
        throw err
    }
}


//generate jwt token of payload example : {id:"hjbf87fuiewjf",email:"test@gmail.com"}
module.exports.genToken = async(payload)=>{
    try{
        return jwt.sign(payload,config.get('jwt'));
    }catch(err){
        throw err
    }
}