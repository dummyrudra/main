/**
 *  security:
 *      - ApiTokenAuth: []
 */

/**
 * @swagger
 * /api/v1/roles:
 *   get:
 *     summary: Get All Default Roles
 *     tags: [Roles]
 *     description: Get All Default Roles
 *     consumes:
 *       - application/json
 *     schema:
 *          type: string
 *          required: true
 *          description: roleId
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Roles'
 *       404:
 *         description: There is no default Roles available .
 *       500:
 *         description: Internal Server Error.
 *
 */

/**
 * @swagger
 * /api/v1/roles/tenant/{id}:
 *   get:
 *     summary: Get Roles By Tenant ID
 *     tags: [Roles]
 *     description: All Roles by specified tenant.
 *     consumes:
 *       - application/json
 *     parameters:
 *         - in: path
 *           name: id
 *           example: 62011f09042a68d1e17222d0
 *     schema:
 *          type: string
 *          required: true
 *          description: tenant ID
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Roles'
 *       404:
 *         description: There is no Role available of specified Id..
 *       500:
 *         description: Internbal Server Error.
 *
 */

/**
 * @swagger
 * /api/v1/roles/organization/{id}:
 *   get:
 *     summary: Get Role By Organization ID
 *     tags: [Roles]
 *     description: All Roles in Organization
 *     consumes:
 *       - application/json
 *     parameters:
 *         - in: path
 *           name: id
 *           example: 62010bd0d169400ebaa8b40a
 *     schema:
 *          type: string
 *          required: true
 *          description: organization ID
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Roles'
 *       400:
 *         description: There is no organization of specified Id.
 *       404:
 *         description: There is no Roles available .
 *       500:
 *         description: Internbal Server Error.
 *
 */

/**
 * @swagger
 * tags:
 *   name: Roles
 *   description: API to Manage Roles.
 * /api/v1/roles:
 *   post:
 *     security:
 *       - ApiTokenAuth: []
 *     summary: Add New Roles
 *     tags: [Roles]
 *     description: Add New Roles
 *     consumes:
 *       - application/json
 *     requestBody:
 *       description: required inputs to create role
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *              type: object
 *              example:
 *                  roleName: "Admin2"
 *                  organization: 61f92db75dd8e639f9358a8b
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Roles'
 *       401:
 *         description: Access Token is expired or invalid.
 *       400:
 *         description: There is no Tenant/Organization of specified Id or Role Name is Already Taken
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * tags:
 *   name: Roles
 *   description: API to Manage Roles.
 * /api/v1/roles/{id}:
 *   put:
 *     security:
 *       - ApiTokenAuth: []
 *     summary: Update Role
 *     tags: [Roles]
 *     description: Update Role
 *     parameters:
 *         - in: path
 *           name: id
 *           example: 620122b11771f1acc2141742
 *     consumes:
 *       - application/json
 *     requestBody:
 *       description: required inputs to update role
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *              type: object
 *              example:
 *                  roleName: "Admin2"
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Roles'
 *       401:
 *         description: Access Token is expired or invalid.
 *       400:
 *         description: There is no Tenant of specified Id or Role Name is Already Taken or No Role of specified Id
 *       403:
 *         description: You Don't have permission to delete default roles.
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /api/v1/roles/{id}:
 *   delete:
 *     security:
 *       - ApiTokenAuth: []
 *     summary: Delete Role By Role Id
 *     tags: [Roles]
 *     description: Delete Role
 *     consumes:
 *       - application/json
 *     parameters:
 *         - in: path
 *           name: id
 *           example: 61fa1074dd07767e047ea7aa
 *     responses:
 *       401:
 *         description: Access Token is expired or invalid.
 *       200:
 *         description: Role deleted successfully.
 *       403:
 *         description: You Don't have permission to delete default roles.
 *       404:
 *         description: There is no Role of specified Id.
 */

/**
 *  @swagger
 *   components:
 *     securitySchemes:
 *       ApiTokenAuth:
 *         type: apiKey
 *         in: header
 *         name: x-auth-token
 *         description: JWT token of user.
 *     schemas:
 *       Roles:
 *         type: Array,
 *         required:
 *           - roleName
 *           - organization
 *         properties:
 *         - id:
 *             type: string
 *             description: The auto-generated id of the role.
 *           tenant:
 *             type: string
 *             description: Tenant ID of role or null for default role.
 *           roleName:
 *             type: string
 *             description:  Name of role
 *           organization:
 *             type: string
 *             description: Organization Id of the Role or null for default role.
 *           permissions:
 *             type: Object
 *             description: Permissions of role.
 *             properties:
 *                  - project:
 *                      type: object,
 *                      properties:
 *                          - create:
 *                              type: Boolean,
 *                            update:
 *                              type: Boolean,
 *                            delete:
 *                              type: Boolean,
 *                            read:
 *                              type: Boolean,
 *           createAt:
 *             type: Date
 *             description: Creation time of role.
 *           updatedAt:
 *             type: Date
 *             description: Updated time of role.*
 *         example:
 *           - _id: "61fa1074dd07767e047ea7aa"
 *             tenant: null
 *             roleName: "Admin"
 *             organization: null
 *             permissions:
 *                 - project:
 *                        create: true,
 *                        update: true,
 *                        delete: true,
 *                        read: true,
 *             createdAt: "2022-02-02T05:02:44.212Z"
 *             updatedAt: "2022-03-02T05:02:44.212Z"
 */
