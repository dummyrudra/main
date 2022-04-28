const router = require('express').Router();
const taskController = require('../controllers/task.controller');
const auth = require('../middlewares/auth');
const getPermission = require('../middlewares/getPermission');
const { validateObjectId } = require('../middlewares/validateObjectID');
const {validateTaskID}=require('../middlewares/validateTaskID')
const taskValidate = require('../validations/task.validate');
const path  = require('path')
const multer = require('multer');
const { addNewTaskToSprint } = require("../controllers/sprint.controller");
const { addTasksToListOnStartSprint } = require('../controllers/list.controller');

//create disk storage on directory url/upload/attachment/
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname,'../public/upload/attachment/'));
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, uniqueSuffix+""+path.extname(file.originalname))
    }
  })
  
const upload = multer({storage});
//get all tasks by project ID
router.get('/project/:id',validateObjectId,auth,getPermission, taskController.getAllTaskByProjectID);
//get task through task ID
router.get('/:id',validateObjectId,validateTaskID,auth,getPermission, taskController.getTaskByID);
//get tasks through reporter ID
router.get('/user/reporter',auth,getPermission, taskController.getTasksByRepoterId);
//get tasks through reporter ID
router.get('/assignee/:id',validateObjectId,auth,getPermission, taskController.getTasksByAssigeeId);
//create task after create task to add in sprint tasks
router.post('/',upload.array('attachment',10),taskValidate,auth,getPermission,taskController.createTask,addNewTaskToSprint,addTasksToListOnStartSprint);
//create sub task
router.post('/subtask/:id',validateObjectId,validateTaskID,taskValidate,auth,getPermission,taskController.createSubTask)


router.patch('/watch/:id',validateObjectId,validateTaskID,auth,getPermission,taskController.addWatch)

router.patch('/vote/:id',validateObjectId,validateTaskID,auth,getPermission,taskController.addVote)
//update task
router.patch('/:id',validateObjectId,validateTaskID,upload.array('attachment',10),auth,getPermission, taskController.updateTask)

//delete task through task ID
router.delete('/:id',validateObjectId ,validateTaskID,auth,getPermission, taskController.deleteTask)




module.exports = router