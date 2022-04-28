/**
 * @swagger
 * tags:
 *  name:Auth
 *  description:API For authenticate user
 */

/**
 * @swagger
 * /api/v1/auth/login:
 *  post:
 *      summary: Authenticate user by email or password
 *      tags: [Auth]
 *      requestBody:
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      example:   # Sample object
 *                          email: testcooper321@gmail.com
 *                          password: Test@123
 *      responses:
 *          200:
 *            description: Return token with payload of user details
 *          content:
 *            application/json:
 *
 */

/**
 * @swagger
 * /api/v1/auth/generate-otp:
 *  patch:
 *      summary: Generate unique 4 digit otp and send it to the client mail
 *      tags: [Auth]
 *      requestBody:
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      example:   # Sample object
 *                          email: testcooper321@gmail.com
 *      responses:
 *          200:
 *            description: Return success message
 *          404:
 *            description: Return user not found message
 *          content:
 *            application/json:
 *
 */

/**
 * @swagger
 * /api/v1/auth/verify-otp:
 *  patch:
 *      summary: Verify otp and send one time unique url token
 *      tags: [Auth]
 *      requestBody:
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      example:   # Sample object
 *                          email: testcooper321@gmail.com
 *                          otp: "1234"
 *      responses:
 *          200:
 *            description: Return success message
 *          400:
 *            description: Return otp miss matched
 *          content:
 *            application/json:
 *
 */

/**
 * @swagger
 * /api/v1/auth/reset-password/{token}:
 *  patch:
 *      summary: verify unique one time token and change password
 *      tags: [Auth]
 *      parameters:
 *          - in: path
 *            name: token
 *      requestBody:
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      example:   # Sample object
 *                          password: "Test@12345"
 *      responses:
 *          200:
 *            description: Return success message
 *          401:
 *            description: Return Link expired
 *          content:
 *            application/json:
 *
 */
/**
 * @swagger
 * /api/v1/auth/change-password/{id}:
 *  patch:
 *      security:
 *       - ApiTokenAuth: []
 *      summary: verify current password and change password of user
 *      tags: [Auth]
 *      parameters:
 *          - in: path
 *            name: id
 *            example: 62010bd0d169400ebaa8b40a
 *            description: User Id
 *      requestBody:
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      example:   # Sample object
 *                          currentPassword: "Test@12345"
 *                          newPassword: "Update@12345"
 *      responses:
 *          200:
 *            description: Password Updated successfully.
 *          401:
 *            description: Invalid Token.
 *          404:
 *            description: User not found of specified id.
 *          400:
 *            description: Invalid Current Password or old password is used.
 *
 *
 */

/**
 * @swagger
 * /api/v1/auth/send-invite/{id}:
 *  post:
 *      summary: email and password and password reset link is send to it to the invited user
 *      tags: [Auth]
 *      security:
 *       - ApiTokenAuth: []
 *      parameters:
 *          - in: path
 *            name: id
 *            schema:
 *              type: string
 *              example:   # Sample object
 *                  "61fa2f4e26c577c815e424b3"
 *      requestBody:
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      example:   # Sample object
 *                          email: usercooper@gmail.com
 *      responses:
 *          200:
 *            description: Return success message
 *          401:
 *            description: Return something went wrong
 *          content:
 *            application/json:
 *
 */
