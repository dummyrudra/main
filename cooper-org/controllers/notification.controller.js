const Notification = require('../models/notification.model')


//get all notification by user ID
module.exports.getNotification = async(req, res, next)=>{
    try{
        //extract user notification by user ID 
        const notification =  await Notification.find({'recipients.user':req.params.id}).populate('sender','fullName email').populate('recipients.user','fullName email').select('-__v -updatedAt -recipients');
        res.send(notification);
    }
    catch(err){
        next(err);
    }
}
