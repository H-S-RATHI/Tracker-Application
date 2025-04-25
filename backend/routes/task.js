const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Task = require('../models/Task');
const Project = require('../models/Project');

// Create a task
router.post('/', auth, async (req, res) => {
  try {
    const { title, description, status, projectId } = req.body;
    const project = await Project.findOne({ _id: projectId, user: req.user.id });
    if (!project) return res.status(404).json({ message: 'Project not found.' });
    const task = new Task({ title, description, status, project: projectId });
    await task.save();
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// Get all tasks for a project
router.get('/:projectId', auth, async (req, res) => {
  try {
    const project = await Project.findOne({ _id: req.params.projectId, user: req.user.id });
    if (!project) return res.status(404).json({ message: 'Project not found.' });
    const tasks = await Task.find({ project: req.params.projectId });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// Update a task
router.put('/:taskId', auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.taskId);
    if (!task) return res.status(404).json({ message: 'Task not found.' });
    // Only allow update if user owns the project
    const project = await Project.findOne({ _id: task.project, user: req.user.id });
    if (!project) return res.status(403).json({ message: 'Forbidden.' });
    Object.assign(task, req.body);
    if (req.body.status === 'completed' && !task.completedAt) {
      task.completedAt = new Date();
    }
    await task.save();
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// Delete a task
router.delete('/:taskId', auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.taskId);
    if (!task) return res.status(404).json({ message: 'Task not found.' });
    const project = await Project.findOne({ _id: task.project, user: req.user.id });
    if (!project) return res.status(403).json({ message: 'Forbidden.' });
    await task.remove();
    res.json({ message: 'Task deleted.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = router;
