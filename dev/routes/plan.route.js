const express=require('express')
const { planValidate } = require('../validations/plan.validate')
const planController=require('../controllers/plan.controller')
const { validateObjectId } = require('../middlewares/validateObjectID')

const router=express.Router()


router.post('/',planValidate,planController.createPlan)

router.get('/:id',validateObjectId,planController.getPlanById)

router.get('/plantype/:type',planController.getPlanByPlanType)

router.put('/:id',validateObjectId,planValidate,planController.updatePlan)

router.delete('/:id',validateObjectId,planController.deletePlanById)

module.exports=router