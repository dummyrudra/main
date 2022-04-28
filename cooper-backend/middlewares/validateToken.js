const jwt = require('jsonwebtoken');
const config = require('config')

//generate jwt token of payload 
module.exports.genToken = async(req , res ,next)=>{
    try{
        const token = req.header('x-auth-token');
        if(!token) return res.status(404).send({message:"Token not found"});
        const payload = await jwt.verify(token,config.get('jwt'));
        if(!payload) return res.status(401).send({message:"UnAuthorized"});
        req.body.payload = payload;
        next();
    }catch(err){
        next(err);
    }
}