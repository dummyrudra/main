/**
 * @swagger
 * /api/v1/user:
 *   get:
 *     security:
 *       - ApiTokenAuth: []
 *     summary: Get All User
 *     tags: [User]
 *     description: Get All User
 *     consumes:
 *       - application/json
 *     schema:
 *          type: string
 *          required: true
 *          description: userId
 *     responses:
 *       401:
 *         description: Access Token is expired or invalid.
 *       200:
 *         description: Success
 *       400:
 *         description: failed
 *
 */

/**
 * @swagger
 * /api/v1/user/{id}:
 *   get:
 *     security:
 *       - ApiTokenAuth: []
 *     summary: Get User By ID
 *     tags: [User]
 *     description: Get User
 *     parameters:
 *          - in: path
 *            name: id
 *            description: user ID
 *            required: true
 *     consumes:
 *       - application/json
 *     schema:
 *          type: string
 *          required: true
 *          description: userId
 *     responses:
 *       401:
 *         description: Access Token is expired or invalid.
 *       200:
 *         description: Success
 *       400:
 *         description: failed
 *
 */

/**
 * @swagger
 * /api/v1/user/organization/{id}:
 *   get:
 *     security:
 *       - ApiTokenAuth: []
 *     summary: Get User By organization ID
 *     tags: [User]
 *     description: Get User By Organization
 *     parameters:
 *          - in: path
 *            name: id
 *            description: organization  ID
 *            required: true
 *     consumes:
 *       - application/json
 *     schema:
 *          type: string
 *          required: true
 *          description: userId
 *     responses:
 *       401:
 *         description: Access Token is expired or invalid.
 *       200:
 *         description: Success
 *       400:
 *         description: failed
 *
 */

/**
 * @swagger
 * tags:
 *   name: User
 *   description: API to manage users.
 * /api/v1/user/signup:
 *   post:
 *     summary: SignUp To User
 *     tags: [User]
 *     description: SignUp User
 *     consumes:
 *       - application/json
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *           required:
 *             - fullName
 *             - email
 *             - password
 *           properties:
 *             fullName:
 *               type: string
 *             email:
 *               type: string
 *             password:
 *               type: string
 *           example:
 *             fullName: test cooper
 *             email: testcooper321@gmail.com
 *             password: "Test@123"
 *     responses:
 *       200:
 *         description: Success
 *       400:
 *         description: failed
 *
 */

/**
 * @swagger
 * /api/v1/user/{id}:
 *   patch:
 *     security:
 *       - ApiTokenAuth: []
 *     summary: Update User By ID
 *     tags: [User]
 *     description: Update User
 *     parameters:
 *          - in: path
 *            name: id
 *            description: user ID
 *            required: true
 *     consumes:
 *       - application/json
 *     schema:
 *          type: string
 *          required: true
 *          description: userId
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *           required:
 *             - fullName
 *             - email
 *           properties:
 *             fullName:
 *               type: string
 *             email:
 *               type: string
 *           example:
 *             fullName: test cooper
 *             email: testcooper321@gmail.com
 *     responses:
 *       401:
 *         description: Access Token is expired or invalid.
 *       200:
 *         description: Success
 *       400:
 *         description: failed
 *
 */

/**
 * @swagger
 * /api/v1/user/{id}:
 *   delete:
 *     security:
 *       - ApiTokenAuth: []
 *     summary: Delete User By ID
 *     tags: [User]
 *     description: Delete User
 *     parameters:
 *          - in: path
 *            name: id
 *            description: user ID
 *            required: true
 *     consumes:
 *       - application/json
 *     schema:
 *          type: string
 *          required: true
 *          description: userId
 *     responses:
 *       401:
 *         description: Access Token is expired or invalid.
 *       200:
 *         description: Successfully Deleted
 *       400:
 *         description: failed
 *
 */

/**
 *  @swagger
 *   components:
 *     schemas:
 *       User:
 *         type: object
 *         required:
 *           - fullName
 *           - email
 *           - password
 *         properties:
 *           id:
 *             type: string
 *             description: The auto-generated id of the user.
 *           tenant:
 *             type: string
 *             description: tanant ID of user
 *           role:
 *             type: string
 *             description: role ID of user
 *           fullName:
 *             type: string
 *             description: The name of the user.
 *           email:
 *             type: string
 *             description: email address of user.
 *           password:
 *             type: string
 *             description: password of user.
 *           jobTitle:
 *             type: string
 *             description: job title of user
 *           department:
 *             type: string
 *             description: department of user
 *           organization:
 *             type: string
 *             description: organization ID of user
 *           username:
 *             type: string
 *             description: username of user.
 *           isDeleted:
 *             type: boolean
 *             description: user availablity status.
 *         example:
 *            fullName: test
 *            email: testcooper321@gmail.com
 *            password: "Teast@123"
 */
