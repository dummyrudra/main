/**
 * @swagger
 * tags:
 *  name:Organization
 *  description:API to manage Organization
 */

/**
 * @swagger
 * /api/v1/organization?limit=5:
 *  get:
 *      security:
 *        - ApiTokenAuth: []
 *      summary: Get all organizations
 *      tags: [Organization]
 *      parameters:
 *          - in: query
 *            name: limit
 *            schema:
 *              type: string
 *              example:   # Sample object
 *                  2
 *      responses:
 *          401:
 *            description: Access Token is expired or invalid.
 *          200:
 *            description: Return organizations.
 *
 */

/**
 * @swagger
 * /api/v1/organization/{id}:
 *  get:
 *      security:
 *       - ApiTokenAuth: []
 *      tags: [Organization]
 *      summary: Get organization by ID
 *      consumes:
 *       - application/json
 *      parameters:
 *         - in: path
 *           name: id
 *           example: 61fcfbd9d824a4d17c902847
 *      responses:
 *          401:
 *            description: Access Token is expired or invalid.
 *          400:
 *            description: Organization not found
 *          200:
 *            description: Return organizations.
 *
 */

/**
 * @swagger
 * /api/v1/organization:
 *  post:
 *      security:
 *        - ApiTokenAuth: []
 *      summary: Create new Organization
 *      tags: [Organization]
 *      requestBody:
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      example:   # Sample object
 *                          tenant: "61fba0ba35a56f19ab4fa9e1"
 *                          organizationName: "Rudra"
 *                          organizationType: "IT SERVICES"
 *                          organizationUrl: "rudra.com"
 *      responses:
 *          401:
 *            description: Access Token is expired or invalid.
 *          200:
 *            description: Return organization with  id
 *          content:
 *              application/json:
 *
 */

/**
 * @swagger
 * tags:
 *   name: Organization
 *   description: API to Manage organization.
 * /api/v1/organization/join/{id}:
 *   patch:
 *     security:
 *       - ApiTokenAuth: []
 *     summary: Join organization.
 *     tags: [Organization]
 *     parameters:
 *         - in: path
 *           name: id
 *           example: 620122b11771f1acc2141742
 *     consumes:
 *       - application/json
 *     requestBody:
 *       description: required inputs to join organization.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *              type: object
 *              example:
 *                  user: "620122b11771f1acc2141742"
 *     responses:
 *       200:
 *         description: User successfully added to organization.
 *       401:
 *         description: Access Token is expired or invalid or you don't have permission.
 *       400:
 *         description: Organization not found.
 *       500:
 *         description: Internal Server Error
 */

// /**
//  * @swagger
//  * tags:
//  *   name: Organization
//  *   description: API to Manage organization.
//  * /api/v1/organization/leave/{id}:
//  *   patch:
//  *     security:
//  *       - ApiTokenAuth: []
//  *     summary: Leave organization.
//  *     tags: [Organization]
//  *     description: Leave organization.
//  *     parameters:
//  *         - in: path
//  *           name: id
//  *           example: 620122b11771f1acc2141742
//  *     consumes:
//  *       - application/json
//  *     requestBody:
//  *       description: required inputs to leave organizatiom
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *              type: object
//  *              example:
//  *                  user: "61fba63dbfa413035ca7a3dc"
//  *     responses:
//  *       200:
//  *         description: User successfully removed from organization.
//  *       401:
//  *         description: Access Token is expired or invalid or you don't have permission'.
//  *       400:
//  *         description: Organization not found.
//  *       500:
//  *         description: Internal Server Error
//  */
