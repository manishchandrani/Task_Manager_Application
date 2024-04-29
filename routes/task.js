var express = require('express');
var router = express.Router();
const taskRepo = require('../controllers/taskRepo');

// /* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });

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

/* GET Create task Page */
router.get('/new', (req, res, next) => {
  res.render('new',{title: 'Create a New Task', buttonText: 'Create Task', actionURL: 'new'});
});

/* POST task details from Create Task Page */
router.post('/new', async (req, res, next) => {
  try {
    const { title, description, dueDate, completed } = req.body;
    const taskData = { title, description, dueDate, completed };
    await taskRepo.createNewTask(taskData);
    res.redirect('/tasks');
  } catch (error) {
    console.error("Error creating task:", error);
    res.status(500).send("Error creating task");
  }
});

module.exports = router;
