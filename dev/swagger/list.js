
/** 
 * @swagger 
 * /api/v1/list/{id}: 
 *   get: 
 *     security:
 *       - ApiTokenAuth: []
 *     summary: Get List By Project ID
 *     tags: [List]
 *     description: Get List
 *     consumes:
 *       - application/json
 *     parameters:
 *         - in: path
 *           name: id
 *           description: ProjectID
 *     schema:
 *          type: string
 *          required: true
 *          description: projectId
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
 *   name: List
 *   description: API to Manage List.
 * /api/v1/list/{id}:
 *   post:
 *     security:
 *       - ApiTokenAuth: []
 *     summary: Add New ListName
 *     tags: [List]
 *     description: Add New ListName
 *     parameters:
 *         - in: path
 *           name: id
 *           description: projectID
 *     requestBody:
 *       description: required inputs to create listName.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *              type: object
 *              example:
 *                  listName: "In Progress"
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/List'
 *       400:
 *         description: Invalid Inputs
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * tags:
 *   name: List
 *   description: API to Manage List.
 * /api/v1/list/{id}:
 *   patch:
 *     security:
 *       - ApiTokenAuth: []
 *     summary: Update the ListName
 *     tags: [List]
 *     description: Update the ListName
 *     parameters:
 *         - in: path
 *           name: id
 *           description: listID
 *     requestBody:
 *       description: required inputs to update plan.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *              type: object
 *              example:
 *                  listName: "In Design"
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/List'
 *       400:
 *         description: Invalid Inputs
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /api/v1/list/drag/{id}:
 *   patch:
 *     security:
 *       - ApiTokenAuth: []
 *     summary: Update the List from one to another
 *     tags: [List]
 *     description: Update the listID
 *     parameters:
 *         - in: path
 *           name: id
 *           description: new listID
 *     requestBody:
 *       description: required inputs to update list.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *              type: object
 *              example:
 *                  task: "782398238ji8rf"
 *                  previousList: "8732476832947834"
 *                  position: "2"
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/List'
 *       400:
 *         description: Invalid Inputs
 *       500:
 *         description: Internal Server Error
 */


/** 
 * @swagger 
 * /api/v1/list/{id}: 
 *   delete: 
 *     security:
 *       - ApiTokenAuth: []
 *     summary: Delete List By ID
 *     tags: [List]
 *     description: Delete List
 *     consumes:
 *       - application/json
 *     parameters:
 *         - in: path
 *           name: id
 *           description: ListID
 *     schema:
 *          type: string
 *          required: true
 *          description: ListId
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
 *       List:
 *         type: object,
 *         required:
 *           - listName
 *           - projectID
 *         properties:
 *         - id:
 *             type: string
 *             description: The auto-generated id of the list.
 *           listName:
 *             type: string
 *             description: Name of List.
 *           projectID:
 *             type: string
 *             description: project ID.
 *           tasks:
 *             type: array
 *             description: tasks on list
 */
