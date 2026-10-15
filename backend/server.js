import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS and JSON parsing middleware
app.use(cors());
app.use(express.json());

// In-memory array for tasks
let tasks = [];
let nextId = 1;

// 1️⃣ Get All Tasks
// GET /tasks
app.get('/tasks', (req, res) => {
  res.json(tasks);
});

// 2️⃣ Create Task
// POST /tasks
app.post('/tasks', (req, res) => {
  const { title } = req.body;

  // Title must not be empty (validation)
  if (!title || typeof title !== 'string' || title.trim() === '') {
    return res.status(400).json({ error: 'Title is required and must not be empty' });
  }

  const newTask = {
    id: nextId++,
    title: title.trim(),
    status: 'todo' // Default status
  };

  tasks.push(newTask);
  res.status(201).json(newTask);
});

// 3️⃣ Update Task Status
// PUT /tasks/:id
app.put('/tasks/:id', (req, res) => {
  const taskId = parseInt(req.params.id, 10);
  const { status } = req.body;

  // Validate ID format
  if (isNaN(taskId)) {
    return res.status(400).json({ error: 'Invalid task ID format' });
  }

  // Validate Status is "todo" or "done"
  if (status !== 'todo' && status !== 'done' && status !== "inProgress") {
    return res.status(400).json({ error: 'Status must be either "todo" or "done"' });
  }

  // Find task
  const taskIndex = tasks.findIndex(t => t.id === taskId);
  if (taskIndex === -1) {
    return res.status(404).json({ error: `Task with ID ${taskId} not found` });
  }

  // Update status
  tasks[taskIndex].status = status;

  res.json(tasks[taskIndex]);
});

// app.put('/tasks/:id', (req, res) => {
//   setTimeout(() => {
//     res.status(500).json({
//       error: 'Simulated failure after delay'
//     });
//   }, 3000);
// });

// 4️⃣ Delete Task
// DELETE /tasks/:id
app.delete('/tasks/:id', (req, res) => {
  const taskId = parseInt(req.params.id, 10);

  if (isNaN(taskId)) {
    return res.status(400).json({ error: 'Invalid task ID format' });
  }

  // Find task
  const taskIndex = tasks.findIndex(t => t.id === taskId);
  if (taskIndex === -1) {
    return res.status(404).json({ error: `Task with ID ${taskId} not found` });
  }

  // Remove task from array
  const deletedTask = tasks.splice(taskIndex, 1)[0];

  res.json({ message: 'Task deleted successfully', task: deletedTask });
});

// Start Express server
app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
