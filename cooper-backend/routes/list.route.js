const express=require('express')
const listController=require('../controllers/list.controller')
const auth = require('../middlewares/auth')
const getPermission = require('../middlewares/getPermission')
const { validateListID } = require('../middlewares/validateListID')
const { validateObjectId } = require('../middlewares/validateObjectID')


const router=express.Router()

//get all lists through projectID
router.get('/:id',validateObjectId,auth,getPermission,listController.getListNameByProjectID)
//add new list in project 
router.post('/:id',validateObjectId,auth,getPermission,listController.addListName)
//update the list name through list ID
router.patch('/:id',validateObjectId,validateListID,auth,getPermission,listController.updateListName)
//drag task from one list to another list
router.patch('/drag/:id',validateObjectId,validateListID,auth,getPermission,listController.DragTaskToListByListID)
//delete list through listID
router.delete('/:id',validateObjectId,validateListID,auth,getPermission,listController.deleteListName)


module.exports=router