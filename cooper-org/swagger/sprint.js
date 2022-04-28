/**
 * @swagger
 * /api/v1/sprints/project/{id}:
 *   get:
 *     security:
 *       - ApiTokenAuth: []
 *     summary: Get sprints by project ID
 *     tags: [Sprints]
 *     description: All Sprints of the Project.
 *     consumes:
 *       - application/json
 *     parameters:
 *         - in: path
 *           name: id
 *           example: 61fcfbd9d824a4d17c902847
 *     schema:
 *          type: string
 *          required: true
 *          description: Project ID
 *     responses:
 *       401:
 *         description: Access Token is expired or invalid.
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Sprints'
 *       400:
 *         description: There is no project available of specified Id.
 *       404:
 *         description: There is no sprint available of specified Project Id..
 *       500:
 *         description: Internbal Server Error.
 *
 */

/**
 * @swagger
 * tags:
 *   name: Sprints
 *   description: API to Manage Sprints.
 * /api/v1/sprints:
 *   post:
 *     security:
 *       - ApiTokenAuth: []
 *     summary: Add New Sprint
 *     tags: [Sprints]
 *     description: Add New Sprint
 *     consumes:
 *       - application/json
 *     requestBody:
 *       description: required inputs to create sprint.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *              type: object
 *              example:
 *                  sprintName: "S1-swagger"
 *                  startDate: "02/21/2022"
 *                  project: "61fba0ba35a56f19ab4fa9e1"
 *                  endDate: "02/25/2022"
 *                  duration: "1"
 *                  sprintGoal: "new sprint"
 *     responses:
 *       401:
 *         description: Access Token is expired or invalid.
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Sprints'
 *       400:
 *         description: Invalid Inputs
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * tags:
 *   name: Sprints
 *   description: API to Manage Sprints.
 * /api/v1/sprints/{id}:
 *   put:
 *     security:
 *       - ApiTokenAuth: []
 *     summary: Update Sprint
 *     tags: [Sprints]
 *     description: Update New Sprint
 *     parameters:
 *         - in: path
 *           name: id
 *           example: 6200d5a6d1181c460b08234a
 *           description: Sprint Id
 *     consumes:
 *       - application/json
 *     requestBody:
 *       description: required inputs to update sprint.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *              type: object
 *              example:
 *                  sprintName: "S1-swaggerUp"
 *                  startDate: "02/21/2022"
 *                  endDate: "02/25/2022"
 *                  duration: 1
 *                  sprintGoal: "new sprint"
 *     responses:
 *       401:
 *         description: Access Token is expired or invalid.
 *       200:
 *         description: Sprint updated successfully.
 *       400:
 *         description: Invalid Inputs.
 *       500:
 *         description: Internal Server Error.
 */

/**
 * @swagger
 * tags:
 *   name: Sprints
 *   description: API to Manage Sprints.
 * /api/v1/sprints/drag-task/{id}:
 *   patch:
 *     security:
 *       - ApiTokenAuth: []
 *     summary: Update Tasks in sprint
 *     tags: [Sprints]
 *     description:  Update Tasks in sprint
 *     parameters:
 *         - in: path
 *           name: id
 *           example: 6200d5a6d1181c460b08234a
 *           description: New Sprint Id
 *     consumes:
 *       - application/json
 *     requestBody:
 *       description: required inputs to update tasks in sprint.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *              type: object
 *              example:
 *                  previousSprint: 6200d5a6d1181c460b08234a
 *                  tasks: ["6200d5a6d1181c460b08234a"]
 *                  position: 0
 *     responses:
 *       401:
 *         description: Access Token is expired or invalid.
 *       200:
 *         description: Task sucessfully dragged.
 *       400:
 *         description: Invalid Inputs
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /api/v1/sprints/{id}:
 *   delete:
 *     security:
 *       - ApiTokenAuth: []
 *     summary: Delete Sprint By Sprint Id
 *     tags: [Sprints]
 *     description: Delete Sprint
 *     consumes:
 *       - application/json
 *     parameters:
 *         - in: path
 *           name: id
 *           example: 61fa1074dd07767e047ea7aa
 *           description: Sprint Id
 *     responses:
 *       401:
 *         description: Access Token is expired or invalid.
 *       200:
 *         description: Sprint deleted successfully.
 *       400:
 *         description: There is no sprint of specified sprint Id.
 */

/**
 * @swagger
 * /api/v1/sprints/complete-sprint/{id}:
 *   delete:
 *     security:
 *       - ApiTokenAuth: []
 *     summary: Complete Sprint By Sprint Id
 *     tags: [Sprints]
 *     description: Complete Sprint
 *     consumes:
 *       - application/json
 *     parameters:
 *         - in: path
 *           name: id
 *           example: 61fa1074dd07767e047ea7aa
 *           description: Sprint Id
 *     responses:
 *       401:
 *         description: Access Token is expired or invalid.
 *       200:
 *         description: Sprint deleted successfully.
 *       400:
 *         description: There is no sprint of specified sprint Id or sprint is not started.
 */

/**
 *  @swagger
 *   components:
 *     schemas:
 *       Sprints:
 *         type: Array,
 *         required:
 *           - sprintName
 *           - project
 *           - startDate
 *           - endDate
 *           - duration
 *           - sprintGoal
 *           - createdBy
 *           - tasks
 *         properties:
 *         - id:
 *             type: string
 *             description: The auto-generated id of the sprint.
 *         - project:
 *             type: object
 *             description: Project ID of sprint.
 *             properties:
 *                    _id:
 *                          type: string
 *                          description: Id of the project.
 *                    projectName:
 *                          type: string
 *                          description: Name of the project
 *                    key:
 *                          type: string
 *                          description: Key of the project
 *           sprintName:
 *             type: string
 *             description:  Name of sprint.
 *           startDate:
 *             type: date
 *             description: Start Date of sprint.
 *           endDate:
 *             type: date
 *             description: End Date of sprint.
 *           duration:
 *             type: number
 *             description: Duration of sprint(in week).
 *           sprintGoal:
 *             type: string
 *             description: Sprint Goal.
 *           createdBy:
 *             type: string
 *             description: Sprint creator User ID.
 *           tasks:
 *              type: array
 *              description: Tasks of sprint.
 *              properties:
 *                  _id:
 *                      type: string,
 *                      description:  ID of Task
 *                  issueType:
 *                      type: string
 *                      description: Issue type of task.
 *                  listID:
 *                      type: string,
 *                      description:  ID of List
 *                  summary:
 *                      type: string
 *                      description: Summary of task.
 *                  description:
 *                      type: string,
 *                      description:  Description of Task
 *                  assigneeID:
 *                      type: string
 *                      description: AssigneeID of task.
 *                  labels:
 *                      type: string,
 *                      description:  labels of task
 *                  storyPointEstimate:
 *                      type: integer
 *                      description: 2.
 *                  attachment:
 *                      type: array
 *                      description: Attachments of task.
 *                  reporter:
 *                      type: string,
 *                      description:  Reporter ID of task
 *                  watched:
 *                      type: array
 *                      description: watched.
 *                  voted:
 *                      type: string,
 *                      description:  voted
 *                  flag:
 *                      type: string
 *                      description: flag of task.
 *                  comments:
 *                      type: array,
 *                      description:  comments of task
 *         example:
 *           - _id: "61fd2da36e58bdd8f18d0246"
 *             sprintName: "R1-01"
 *             project:
 *                  - _id: "61fd2da36e58bdd8f18d0"
 *                    projectName: Cooper
 *                    key: COOP
 *             duration: 4
 *             startDate: "2022-02-02T05:02:44.212Z"
 *             endDate: "2022-03-02T05:02:44.212Z"
 *             sprintGoal: "Design logo....."
 *             createdBy: "61fbb1f51c619aacb9ac746d"
 *             tasks:
 *                  - _id: 62148cb578d4a7641cbd5bd6
 *                    issueType: "bug"
 *                    listID: 62148bce100377e812fa36b2
 *                    summary: "Its a project Management"
 *                    description: "commercial"
 *                    assigneeID: null
 *                    labels: "cooperdemo2"
 *                    storyPointEstimate: 2
 *                    attachment: []
 *                    reporter: "62148b7e100377e812fa36a0"
 *                    watched: []
 *                    voted: []
 *                    flag: null
 *                    comments: []
 *                    createdAt: "2022-02-22T07:11:49.744Z"
 *                    updatedAt: "2022-02-22T07:11:49.744Z"
 *             createdAt: "2022-02-04T13:44:03.938Z"
 *             updatedAt: "2022-02-05T13:44:03.938Z"
 */
