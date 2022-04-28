const { getNotification } = require('../controllers/notification.controller');
const { validateObjectId } = require('../middlewares/validateObjectID');
const { validateUserID } = require('../middlewares/validateUserID');

const router = require('express').Router()


//get All notification for specific user
router.get('/:id',validateObjectId,validateUserID,getNotification);

module.exports=router