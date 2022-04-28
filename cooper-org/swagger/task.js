/**
 * @swagger
 * tags:
 *  name: Task
 *  description: API to manage task
 */

/**
 * @swagger
 * components:
 *  schemas:
 *      Task:
 *          type:
 *              object
 *          required:
 *              -projectID
 *              -issueType
 *              -labels
 *              -sprint
 *          properties:
 *              _id:
 *                  type:
 *                      string
 *                  description:
 *                      ID of the task
 *              projectID:
 *                  type:
 *                      string
 *                  description:
 *                      project ID of project
 *              issueType:
 *                  type:
 *                      string
 *                  description:
 *                      Issue type like epic,story,task,bug
 *              listID:
 *                  type:
 *                      string
 *                  description:
 *                      List ID of project
 *              summary:
 *                  type:
 *                      string
 *                  description:
 *                      summary of task
 *              description:
 *                  type:
 *                      string
 *                  description:
 *                      Description of task
 *              assignee:
 *                  type:
 *                      string
 *                  description:
 *                      assignee to task
 *              labels:
 *                  type:
 *                      array
 *                  description:
 *                      labels of this task
 *              sprint:
 *                  type:
 *                      string
 *                  description:
 *                      Sprint of this task
 *              storyPointEstimate:
 *                  type:
 *                      number
 *                  description:
 *                      story point of this task
 *              attachment:
 *                  type:
 *                      file
 *                  description:
 *                      array of attachment
 *              comments:
 *                  type:
 *                      array
 *                  description:
 *                      array of comments
 *              subTask:
 *                  type:
 *                      string
 *                  description:
 *                      ID of sub task
 *              reporter:
 *                  type:
 *                      string
 *                  description:
 *                      reporter of the this task
 *              watched:
 *                  type:
 *                      array
 *                  description:
 *                      array of wached user
 *              voted:
 *                  type:
 *                      array
 *                  description:
 *                      array of voted user
 *              flag:
 *                  type:
 *                      string
 *                  description:
 *                      flag of this task
 *
 */

/**
 * @swagger
 * /api/v1/task/project/{id}:
 *  get:
 *      security:
 *       - ApiTokenAuth: []
 *      summary: Get All task by projectID
 *      tags: [Task]
 *      parameters:
 *          - in: path
 *            name: id
 *            description: project ID
 *            required: true
 *      schema:
 *          type: string
 *          required: true
 *          description: projectID
 *      responses:
 *          401:
 *            description: Access Token is expired or invalid.
 *          200:
 *            description: Return All task
 *          content:
 *            application/json:
 *
 */

/**
 * @swagger
 * /api/v1/task/{id}:
 *  get:
 *      security:
 *       - ApiTokenAuth: []
 *      summary: Get task by task ID
 *      tags: [Task]
 *      parameters:
 *          - in: path
 *            name: id
 *            description: Task ID
 *            required: true
 *            type: string
 *      schema:
 *          type: string
 *          required: true
 *          description: taskId
 *      responses:
 *          401:
 *            description: Access Token is expired or invalid.
 *          200:
 *            description: Return task by Id
 *          content:
 *            application/json:
 *
 */

/**
 * @swagger
 * /api/v1/task/assignee/{id}:
 *  get:
 *      security:
 *       - ApiTokenAuth: []
 *      summary: Get task by assigneeID
 *      tags: [Task]
 *      parameters:
 *          - in: path
 *            name: id
 *            description: Assignee ID
 *            required: true
 *            type: string
 *      schema:
 *          type: string
 *          required: true
 *          description: taskId
 *      responses:
 *          401:
 *            description: Access Token is expired or invalid.
 *          200:
 *            description: Return task by Assignee ID
 *          content:
 *            application/json:
 */

/**
 * @swagger
 * /api/v1/task/user/reporter:
 *  get:
 *      security:
 *       - ApiTokenAuth: []
 *      summary: Get task by reporterID
 *      tags: [Task]
 *      responses:
 *          401:
 *            description: Access Token is expired or invalid.
 *          200:
 *            description: Return task by reporter Id
 *          content:
 *            application/json:
 */

/**
 * @swagger
 * /api/v1/task:
 *  post:
 *      security:
 *       - ApiTokenAuth: []
 *      summary: Create task
 *      tags: [Task]
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: formData
 *            example:
 *              labels: ["cooperdemo"]
 *              projectID: "61fcfa23336ba4b9de05bc7a"
 *              issueType: "bug"
 *              summary: "Its a project Management"
 *              listID: "kjf23778e"
 *              description: "commercial"
 *              assigneeID: "61fba0ba35a56f19ab4fa9e1"
 *              sprint: "6200c91db41b28307a8d857a"
 *              storyPointEstimate: 2
 *      responses:
 *          401:
 *            description: Access Token is expired or invalid.
 *          200:
 *            description: Return saved task with unique ID
 *          content:
 *            application/json:
 *          500:
 *            description: Return error message with 500 status
 *            schema:
 *              ref: '#/components/schemas/task'
 *
 *
 */

/**
 * @swagger
 * /api/v1/task/subtask/{id}:
 *  post:
 *      security:
 *       - ApiTokenAuth: []
 *      summary: Create sub task
 *      tags: [Task]
 *      parameters:
 *          - in: path
 *            name: id
 *            description: task ID
 *            required: true
 *            type: string
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *            example:
 *              labels: ["cooperdemo"]
 *              projectID: "61f2837bd4f0108adc2c0179"
 *              issueType: "bug"
 *              summary: "Its a project Management"
 *              listID: "edfkerf"
 *              description: "commercial"
 *              assigneeID: "61f2837bd4f0108adc2c0179"
 *              sprint: "61f2837bd4f0108adc2c0179"
 *              storyPointEstimate: 2
 *      responses:
 *          401:
 *            description: Access Token is expired or invalid.
 *          200:
 *            description: Return saved subtask with unique ID
 *          content:
 *            application/json:
 *          500:
 *            description: Return error message with 500 status
 *            schema:
 *              ref: '#/components/schemas/task'
 *
 *
 */

/**
 * @swagger
 * /api/v1/task/watch/{id}:
 *  patch:
 *      security:
 *       - ApiTokenAuth: []
 *      summary: watch this task
 *      tags: [Task]
 *      parameters:
 *          - in: path
 *            name: id
 *            description: Task ID
 *            type: string
 *            required: true
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *            example:
 *              userID: "61f2837bd4f0108adc2c0179"
 *      responses:
 *          401:
 *            description: Access Token is expired or invalid.
 *          200:
 *            description: Return watch with unique ID
 *          content:
 *            application/json:
 *          500:
 *            description: Return error message with 500 status
 *            schema:
 *              ref: '#/components/schemas/task'
 *
 *
 */

/**
 * @swagger
 * /api/v1/task/vote/{id}:
 *  patch:
 *      security:
 *       - ApiTokenAuth: []
 *      summary: vote this task
 *      tags: [Task]
 *      parameters:
 *          - in: path
 *            name: id
 *            description: Task ID
 *            type: string
 *            required: true
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *            example:
 *              userID: "61f2837bd4f0108adc2c0179"
 *      responses:
 *          401:
 *            description: Access Token is expired or invalid.
 *          200:
 *            description: Return watch with unique ID
 *          content:
 *            application/json:
 *          500:
 *            description: Return error message with 500 status
 *            schema:
 *              ref: '#/components/schemas/task'
 *
 *
 */

/**
 * @swagger
 * /api/v1/task/{id}:
 *  patch:
 *      security:
 *       - ApiTokenAuth: []
 *      summary: Update task
 *      tags: [Task]
 *      parameters:
 *          - in: path
 *            name: id
 *            description: Task ID
 *            type: string
 *            required: true
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *            example:
 *              labels: ["cooperdemo"]
 *              projectID: "61f2837bd4f0108adc2c0179"
 *              issueType: "bug"
 *              listID: "61fba0ba35a56f19ab4fa9e1"
 *              summary: "Its a project Management"
 *              description: "commercial"
 *              assigneeID: "61f2837bd4f0108adc2c0179"
 *              sprint: "61f2837bd4f0108adc2c0179"
 *              storyPointEstimate: 2
 *      responses:
 *          401:
 *            description: Access Token is expired or invalid.
 *          200:
 *            description: Return updated task with unique ID
 *          content:
 *            application/json:
 *          500:
 *            description: Return error message with 500 status
 *            schema:
 *              ref: '#/components/schemas/task'
 *
 *
 */

/**
 * @swagger
 * /api/v1/task/{id}:
 *  delete:
 *      security:
 *       - ApiTokenAuth: []
 *      summary: Delete task
 *      tags: [Task]
 *      parameters:
 *          - in: path
 *            name: id
 *            description: Task ID
 *            type: string
 *            required: true
 *      responses:
 *          401:
 *            description: Access Token is expired or invalid.
 *          200:
 *            description: Return deleted task with unique ID
 *          content:
 *            application/json:
 *          500:
 *            description: Return error message with 500 status
 *            schema:
 *              ref: '#/components/schemas/task'
 *
 *
 */
