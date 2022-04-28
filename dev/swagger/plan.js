
/** 
 * @swagger 
 * /api/v1/plan/{id}: 
 *   get: 
 *     summary: Get Plan By ID
 *     tags: [Plans]
 *     description: Get Plan
 *     consumes:
 *       - application/json
 *     parameters:
 *         - in: path
 *           name: id
 *     schema:
 *          type: string
 *          required: true
 *          description: planId
 *     responses:  
 *       200: 
 *         description: Success
 *       400:
 *         description: failed 
 *   
 */

/** 
 * @swagger 
 * /api/v1/plan/plantype/{type}: 
 *   get: 
 *     summary: Get Plan By type
 *     tags: [Plans]
 *     description: Get Plan 
 *     parameters:
 *         - in: path
 *           name: type
 *           description: month or annual
 *     schema:
 *          type: string
 *          required: true
 *          description: plan type month,annual
 *     consumes:
 *       - application/json
 *     responses:  
 *       200: 
 *         description: Success
 *       400:
 *         description: failed 
 *   
 */

/**
 * @swagger
 * tags:
 *   name: Plans
 *   description: API to Manage Plans.
 * /api/v1/plan:
 *   post:
 *     summary: Add New Plan
 *     tags: [Plans]
 *     description: Add New Plan
 *     requestBody:
 *       description: required inputs to create plan.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *              type: object
 *              example:
 *                  planName: "113 "
 *                  createdBy: "61fcfa23336ba4b9de05bc7a"
 *                  planType: "month"
 *                  description: "Its our plan"
 *                  amount: 233
 *                  features: [{ "featureName":"It create 10 task", "status":true }, { "featureName":"It create 10 project", "status":true }, { "featureName":"It create 10 backlogs", "status":true }, { "featureName":"It create 10 sprints", "status":true }]
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Plans'
 *       400:
 *         description: Invalid Inputs
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * tags:
 *   name: Plans
 *   description: API to Manage Plans.
 * /api/v1/plan/{id}:
 *   put:
 *     summary: Update the Plan
 *     tags: [Plans]
 *     description: Update the Plan
 *     parameters:
 *         - in: path
 *           name: id
 *           description: planID
 *     requestBody:
 *       description: required inputs to update plan.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *              type: object
 *              example:
 *                  planName: "113"
 *                  createdBy: "61fcfa23336ba4b9de05bc7a"
 *                  planType: "month"
 *                  description: "Its our plan"
 *                  amount: 233
 *                  features: [{ "featureName":"It create 10 task", "status":true }, { "featureName":"It create 10 project", "status":true }, { "featureName":"It create 10 backlogs", "status":true }, { "featureName":"It create 10 sprints", "status":true }]
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Plans'
 *       400:
 *         description: Invalid Inputs
 *       500:
 *         description: Internal Server Error
 */


/** 
 * @swagger 
 * /api/v1/plan/{id}: 
 *   delete: 
 *     summary: Delete Plan By ID
 *     tags: [Plans]
 *     description: Delete Plan
 *     consumes:
 *       - application/json
 *     parameters:
 *         - in: path
 *           name: id
 *     schema:
 *          type: string
 *          required: true
 *          description: planId
 *     responses:  
 *       200: 
 *         description: Success
 *       400:
 *         description: failed 
 *   
 */

/**
 *  @swagger
 *   components:
 *     schemas:
 *       Plans:
 *         type: object,
 *         required:
 *           - planName
 *           - planType
 *           - amount
 *           - features
 *           - createdBy
 *           - description
 *         properties:
 *         - id:
 *             type: string
 *             description: The auto-generated id of the plan.
 *           planName:
 *             type: string
 *             description: Name of plan.
 *           planType:
 *             type: string
 *             description: Plan Type [month,annual].
 *           description:
 *             type: string
 *             description: description of plan.
 *           amount:
 *             type: number
 *             description: plan price.
 *           features:
 *             type: array
 *             description: array of features.
 *           createdBy:
 *             type: string
 *             description: creator User ID.
 */
