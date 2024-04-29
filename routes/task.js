var express = require('express');
var router = express.Router();
const taskRepo = require('../controllers/taskRepo');
const { body, validationResult } = require('express-validator');


/* GET all tasks*/
router.get('/', async (req, res, next) => {
  try {
    const allTaskData = await taskRepo.findAll();
    res.render('tasks', { tasks: allTaskData });
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).send("Error fetching tasks");
  }
});

// Validation middleware
const validateTask = [
  body('title').trim().notEmpty().withMessage('Title required').escape(),
  body('description').trim().notEmpty().withMessage('Description required').escape(),
  body('dueDate').trim().isISO8601().withMessage('Date Required').toDate(),
  body('completed').optional().isBoolean().toBoolean(),
];

/* GET Create task Page */
router.get('/new', (req, res, next) => {
  res.render('new',{title: 'Create a New Task', buttonText: 'Create Task', actionURL: 'new'});
});

/* POST task details from Create Task Page */
router.post('/new', validateTask, async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render('new', { title: 'Create a New Task', buttonText: 'Create Task', actionURL: 'new', msg: errors.array() });
      return;
    }
    
    const { title, description, dueDate, completed } = req.body;
    const taskData = { title, description, dueDate, completed };
    await taskRepo.createNewTask(taskData);
    res.redirect('/tasks');
  } catch (error) {
    console.error("Error creating task:", error);
    res.status(500).send("Error creating task");
  }
});

/* GET Single Task View Page */
router.get('/:id', async (req, res, next) => {
  try {
    const singleTaskData = await taskRepo.findById(req.params.id);
    if (singleTaskData) {
      res.render('singleTask', { task: singleTaskData });
    } else {
      res.redirect('/tasks');
    }
  } catch (error) {
    next(error);
  }
});

/* GET Edit movie Page */
router.get('/:id/edit', async (req, res, next) => {
  const taskData = await taskRepo.findById(req.params.id);
  res.render('edit', { task: taskData, title: 'Edit Task', buttonText: 'Edit task', actionURL: 'edit' });
});

/* POST Updated task Details from Edit Task Page */
router.post('/:id/edit', validateTask, async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render('edit', { task: req.body, title: 'Edit Task', buttonText: 'Edit task', actionURL: 'edit', msg: errors.array() });
      return;
    }
    
    const { title, description, dueDate, completed } = req.body;
    const taskId = req.params.id;
    const updatedTask = { title, description, dueDate, completed };
    await taskRepo.updateTask(taskId, updatedTask);
    res.redirect('/tasks');
  } catch (error) {
    console.error("Error updating task:", error);
    res.status(500).send("Error updating task");
  }
});

/* GET Task Confirm Delete Page */
router.get('/:id/delete', async (req, res, next) => {
  try {
    const taskData = await taskRepo.findById(req.params.id);
    if (taskData) {
      res.render('delete', { task: taskData });
    } else {
      res.status(404).send('Task not found');
    }
  } catch (error) {
    console.error("Error fetching task for deletion:", error);
    res.status(500).send("Error fetching task for deletion");
  }
});

/* POST Task Delete */
router.post('/:id/delete', async (req, res, next) => {
  try {
    const taskId = req.params.id;
    const deletedCount = await taskRepo.deleteTask(taskId);
    if (deletedCount > 0) {
      res.redirect('/tasks');
    } else {
      res.status(404).send('Task not found');
    }
  } catch (error) {
    console.error("Error deleting task:", error);
    res.status(500).send("Error deleting task");
  }
});


module.exports = router;
