const { MongoClient, ObjectId } = require('mongodb');
const Task = require("../models/task");

const url = process.env.MONGODB_URL;
const client = new MongoClient(url);

async function connect() {
  try {
    await client.connect();
    console.log("Successfully Connected to MongoDB Server");
  } catch (err) {
    console.error("Connection unsuccessful", err);
  }
}

connect();

const taskRepo = {
  /* Find all the available tasks */
  findAll: async () => {
    let tasksList = [];
    const tasksCollection = client.db('task_database').collection('tasks');
    const tasksDataFromDB = tasksCollection.find({});
    for await (const data of tasksDataFromDB) {
      const taskObj = new Task(data._id.toString(), data.title, data.description, data.dueDate, data.completed);
      tasksList.push(taskObj);
    }
    return tasksList;
  },

    /* Find a task by id */
    findById: async (id) => {
      const tasksCollection = client.db('task_database').collection('tasks');
      const filter = { _id: new ObjectId(id) };
      const result = await tasksCollection.findOne(filter);
      return new Task(result._id.toString(), result.title, result.description, result.dueDate, result.completed);
    },


  /* Creating a new task into the database */
  createNewTask: async (taskData) => {
    const newTask = { title: taskData.title, description: taskData.description, dueDate: taskData.dueDate, completed: taskData.completed };
    const tasksCollection = client.db('task_database').collection('tasks');
    const result = await tasksCollection.insertOne(newTask);
  }
};

module.exports = taskRepo;

