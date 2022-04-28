/**
 * @swagger
 * tags:
 *  name:Organization
 *  description:API to manage Organization
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
 * /api/v1/organization?name=rudra:
 *  get:
 *      security:
 *        - ApiTokenAuth: []
 *      summary: Get projects by owner Id
 *      tags: [Organization]
 *      parameters:
 *          - in: query
 *            name: name
 *            schema:
 *              type: string
 *              example:   # Sample object
 *                  "rudra"
 *      responses:
 *          401:
 *            description: Access Token is expired or invalid.
 *          200:
 *            description: Return projects by owner Id
 *          content:
 *              application/json:
 *
 */
