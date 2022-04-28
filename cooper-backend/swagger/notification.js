/**
 * @swagger
 * tags:
 *  name:Notification
 *  description:API to manage Notification
 */

/**
 * @swagger
 * /api/v1/notification/{id}:
 *  get:
 *      security:
 *        - ApiTokenAuth: []
 *      summary: Get notification by user Id
 *      tags: [Notification]
 *      parameters:
 *          - in: path
 *            name: id
 *            description: user Id
 *      responses:
 *          401:
 *            description: Access Token is expired or invalid.
 *          200:
 *            description: Return notifications by user Id
 *          content:
 *              application/json:
 *
 */
