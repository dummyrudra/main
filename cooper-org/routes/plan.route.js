const express=require('express')
const { planValidate } = require('../validations/plan.validate')
const planController=require('../controllers/plan.controller')
const { validateObjectId } = require('../middlewares/validateObjectID')

const router=express.Router()

//create a new plan through this route
router.post('/',planValidate,planController.createPlan)
//get plan by plan ID
router.get('/:id',validateObjectId,planController.getPlanById)
//get all plans by plan Type
router.get('/plantype/:type',planController.getPlanByPlanType)
//update the plan through plan ID
router.put('/:id',validateObjectId,planValidate,planController.updatePlan)
//delete plan through plan ID
router.delete('/:id',validateObjectId,planController.deletePlanById)

module.exports=router