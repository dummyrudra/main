const express=require('express')
const listController=require('../controllers/list.controller')
const auth = require('../middlewares/auth')
const getPermission = require('../middlewares/getPermission')
const { validateListID } = require('../middlewares/validateListID')
const { validateObjectId } = require('../middlewares/validateObjectID')


const router=express.Router()


router.get('/:id',validateObjectId,auth,getPermission,listController.getListNameByProjectID)

router.post('/:id',validateObjectId,auth,getPermission,listController.addListName)

router.patch('/:id',validateObjectId,validateListID,auth,getPermission,listController.updateListName)

router.patch('/drag/:id',validateObjectId,validateListID,auth,getPermission,listController.DragTaskToListByListID)

router.delete('/:id',validateObjectId,validateListID,auth,getPermission,listController.deleteListName)


module.exports=router