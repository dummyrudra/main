/**
 * @swagger
 * tags:
 *  name:Project
 *  description:API to manage projects
 */

/**
 * @swagger
 * components:
 *  schemas:
 *      Project:
 *          type:
 *              object
 *          required:
 *              -projectName
 *              -organization
 *              -owner
 *              -key
 *              -projectType
 *              -projectLead
 *          properties:
 *              projectName:
 *                  type:
 *                      string
 *                  description:
 *                      The Name of project
 *              organization:
 *                  type:
 *                      string
 *                  description:
 *                      project belongs to organization
 *              owner:
 *                  type:
 *                      string
 *                  description:
 *                      userID of creator of this project
 *              key:
 *                  type:
 *                      string
 *                  description:
 *                      Unique key
 *              url:
 *                  type:
 *                      string
 *                  description:
 *                      Auto generated url
 *              projectType:
 *                  type:
 *                      string
 *                  description:
 *                      The project type
 *              projectLead:
 *                  type:
 *                      string
 *                  description:
 *                      userId of project leader
 *              avatar:
 *                  type:
 *                      string
 *                  description:
 *                      Icon of this project
 *              description:
 *                  type:
 *                      string
 *                  description:
 *                      Description of this project
 *
 */

/**
 * @swagger
 * /api/v1/project:
 *  post:
 *      security:
 *        - ApiTokenAuth: []
 *      summary: Create new project
 *      tags: [Project]
 *      requestBody:
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      example:   # Sample object
 *                          projectName: Cooper
 *                          key: "COP"
 *                          projectType: "Enterprise"
 *                          projectLead: "61fba63dbfa413035ca7a3dc"
 *                          avatar: "default.png"
 *                          description: "This project is based on pmt"
 *      responses:
 *          401:
 *            description: Access Token is expired or invalid.
 *          200:
 *            description: Return project with project id
 *          content:
 *              application/json:
 *
 */

/**
 * @swagger
 * /api/v1/project/invite/{id}:
 *  post:
 *      security:
 *        - ApiTokenAuth: []
 *      summary: Add new member in project
 *      tags: [Project]
 *      parameters:
 *          - in: path
 *            name: id
 *            description: projectID
 *      requestBody:
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      example:   # Sample object
 *                          users: ["620b3854807c948db469118b"]
 *      responses:
 *          401:
 *            description: Access Token is expired or invalid.
 *          200:
 *            description: Return project with member added
 *          content:
 *              application/json:
 *
 */

/**
 * @swagger
 * /api/v1/project/owner:
 *  get:
 *      security:
 *        - ApiTokenAuth: []
 *      summary: Get projects by owner Id
 *      tags: [Project]
 *      parameters:
 *          - in: path
 *            name: id
 *            schema:
 *              type: string
 *              example:   # Sample object
 *                  "61fba0ba35a56f19ab4fa9e1"
 *      responses:
 *          401:
 *            description: Access Token is expired or invalid.
 *          200:
 *            description: Return projects by owner Id
 *          content:
 *              application/json:
 *
 */

/**
 * @swagger
 * /api/v1/project/projectLead/{id}:
 *  get:
 *      security:
 *        - ApiTokenAuth: []
 *      summary: Get projects by ProjectLeader Id
 *      tags: [Project]
 *      parameters:
 *          - in: path
 *            name: id
 *            schema:
 *              type: string
 *              example:   # Sample object
 *                  "61fba63dbfa413035ca7a3dc"
 *      responses:
 *          401:
 *            description: Access Token is expired or invalid.
 *          200:
 *            description: Return projects by projectLeader Id
 *          content:
 *              application/json:
 *
 */

/**
 * @swagger
 * /api/v1/project/{id}:
 *  get:
 *      security:
 *        - ApiTokenAuth: []
 *      summary: Get project by Id
 *      tags: [Project]
 *      parameters:
 *          - in: path
 *            name: id
 *            schema:
 *              type: string
 *              example:   # Sample object
 *                  "61fba63dbfa413035ca7a3dc"
 *      responses:
 *          401:
 *            description: Access Token is expired or invalid.
 *          200:
 *            description: Return successful message
 *          content:
 *              application/json:
 *
 */

/*
 * @swagger
 * /api/v1/project/{id}:
 *  put:
 *      security:
 *        - ApiTokenAuth: []
 *      summary: Update project by url
 *      tags: [Project]
 *      parameters:
 *          - in: path
 *            name: id
 *            schema:
 *              type: string
 *              example:   # Sample object
 *                  "61fba63dbfa413035ca7a3dc"
 *      requestBody:
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      example:   # Sample object
 *                          projectName: Cooper2
 *                          key: "COP2"
 *                          projectType: "Enterprise"
 *                          projectLead: "61fba63dbfa413035ca7a3dc"
 *                          avatar: "default.png"
 *                          description: "This project is based on pmt and it is updated"
 *      responses:
 *          401:
 *            description: Access Token is expired or invalid.
 *          200:
 *            description: Return sucessfull message
 *          content:
 *              application/json:
 *
 */

/**
 * @swagger
 * /api/v1/project/{id}:
 *  delete:
 *      security:
 *        - ApiTokenAuth: []
 *      summary: Delete project by url
 *      tags: [Project]
 *      parameters:
 *          - in: path
 *            name: id
 *            schema:
 *              type: string
 *              example:   # Sample object
 *                   "61fba63dbfa413035ca7a3dc"
 *      responses:
 *          401:
 *            description: Access Token is expired or invalid.
 *          200:
 *            description: Return successful message
 *          content:
 *              application/json:
 *
 */

/**
 * @swagger
 * /api/v1/project/organization/{id}:
 *  get:
 *      security:
 *        - ApiTokenAuth: []
 *      summary: Get projects by organization Id
 *      tags: [Project]
 *      parameters:
 *          - in: path
 *            name: id
 *            schema:
 *              type: string
 *              example:   # Sample object
 *                  "61fba63dbfa413035ca7a3dc"
 *      responses:
 *          401:
 *            description: Access Token is expired or invalid.
 *          200:
 *            description: Return projects by organization Id
 *          content:
 *              application/json:
 *
 */
