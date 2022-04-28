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

router.get('/project/:id',validateObjectId,auth,getPermission, taskController.getAllTaskByProjectID);

router.get('/:id',validateObjectId,validateTaskID,auth,getPermission, taskController.getTaskByID);

router.get('/user/reporter',auth,getPermission, taskController.getTasksByRepoterId);

router.get('/assignee/:id',validateObjectId,auth,getPermission, taskController.getTasksByAssigeeId);

router.post('/',upload.array('attachment',10),taskValidate,auth,getPermission,taskController.createTask,addNewTaskToSprint,addTasksToListOnStartSprint);

router.post('/subtask/:id',validateObjectId,validateTaskID,taskValidate,auth,getPermission,taskController.createSubTask)


router.patch('/watch/:id',validateObjectId,validateTaskID,auth,getPermission,taskController.addWatch)

router.patch('/vote/:id',validateObjectId,validateTaskID,auth,getPermission,taskController.addVote)

router.patch('/:id',validateObjectId,validateTaskID,upload.array('attachment',10),auth,getPermission, taskController.updateTask)


router.delete('/:id',validateObjectId ,validateTaskID,auth,getPermission, taskController.deleteTask)




module.exports = router