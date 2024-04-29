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

