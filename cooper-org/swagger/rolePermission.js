/**
 * @swagger
 * /api/v1/role-permissions/user/{id}:
 *   get:
 *     summary: Get Role Permission By user Id
 *     tags: [RolePermissions]
 *     description: Get Role Permission By user ID.
 *     parameters:
 *         - in: path
 *           name: id
 *           example: 62010bd0d169400ebaa8b40a
 *     consumes:
 *       - application/json
 *     schema:
 *          type: string
 *          required: true
 *          description: userId
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RolePermissions'
 *       400:
 *         description: If user not found or user have no role permissions assigned yet.
 *       500:
 *         description: Internal Server Error.
 *
 */

/**
 * @swagger
 * tags:
 *   name: RolePermissions
 *   description: API to Manage RolePermissions.
 * /api/v1/role-permissions/assign:
 *   post:
 *     security:
 *       - ApiTokenAuth: []
 *     summary: Assign New Role.
 *     tags: [RolePermissions]
 *     description: Assign New Role.
 *     consumes:
 *       - application/json
 *     requestBody:
 *       description: required inputs to assign role.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *              type: object
 *              example:
 *                  role: 61f92db75dd8e639f9358a8b
 *                  organization: 61f92db75dd8e639f9358a8b
 *                  user: 61f92db75dd8e639f9358a8b
 *     responses:
 *       401:
 *         description: Access Token is expired or invalid.
 *       200:
 *         description: Role assigned successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Roles'
 *       400:
 *         description: There is no Tenant/Organization/User of specified Id or specified Role is already assigned or user is not a part of specified organization.
 *       404:
 *         description: If there is no role of role Id.
 *       403:
 *         description: Tenant is not a admin or trying to change admin's role.
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * tags:
 *   name: RolePermissions
 *   description: API to Manage RolePermissions.
 * /api/v1/role-permissions/revoke:
 *   post:
 *     security:
 *       - ApiTokenAuth: []
 *     summary: revoke New Role.
 *     tags: [RolePermissions]
 *     description: revoke New Role.
 *     consumes:
 *       - application/json
 *     requestBody:
 *       description: required inputs to revoke role.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *              type: object
 *              example:
 *                  role: 61f92db75dd8e639f9358a8b
 *                  organization: 61f92db75dd8e639f9358a8b
 *                  user: 61f92db75dd8e639f9358a8b
 *     responses:
 *       401:
 *         description: Access Token is expired or invalid.
 *       200:
 *         description: Role revoked successfully.
 *       400:
 *         description: There is no Tenant/Organization/User of specified Id or user is not a part of specified organization or there is no role is assigned to the user.
 *       404:
 *         description: If there is no role of role Id.
 *       403:
 *         description: Tenant is not a admin or trying to change admin's role.
 *       500:
 *         description: Internal Server Error
 */

/**
 *  @swagger
 *   components:
 *     schemas:
 *       RolePermissions:
 *         type: Object,
 *         required:
 *           - role
 *           - organization
 *           - user
 *         properties:
 *         - _id:
 *             type: string
 *             description: The auto-generated id of the role permission.
 *           organization:
 *             type: string
 *             description: Organization Id.
 *           tenant:
 *             type: string
 *             description: Tenant ID of organization.
 *           user:
 *             type: string
 *             description: User ID of user whoose role will assigned/revoke.
 *           role:
 *             type: object
 *             description:  role and permissions.
 *             properties:
 *                  - _id:
 *                      type: string
 *                    tenant:
 *                      type: string
 *                    roleName:
 *                      type: string
 *                    organization:
 *                      type: string
 *                    permissions:
 *                      type: object
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
 *           - _id: "6202704a98c711277d79e547"
 *             organization: 620270e298c711277d79e54f
 *             tenant: null
 *             user: 6202704998c711277d79e542
 *             role:
 *                  - _id: "6202704998c711277d79e"
 *                    tenant: null
 *                    roleName: member
 *                    organization: null
 *                    permissions:
 *                      - project:
 *                        create: true,
 *                        update: true,
 *                        delete: true,
 *                        read: true,
 *             createdAt: "2022-02-02T05:02:44.212Z"
 *             updatedAt: "2022-03-02T05:02:44.212Z"
 */
