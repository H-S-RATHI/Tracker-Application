const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Project = require('../models/Project');

// Create a project (max 4 per user)
router.post('/', auth, async (req, res) => {
  try {
    const count = await Project.countDocuments({ user: req.user.id });
    if (count >= 4) {
      return res.status(400).json({ message: 'Maximum 4 projects allowed.' });
    }
    const project = new Project({ name: req.body.name, user: req.user.id });
    await project.save();
    res.json(project);
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// Get all projects for user
router.get('/', auth, async (req, res) => {
  try {
    const projects = await Project.find({ user: req.user.id });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// ...existing code above...

const Task = require('../models/Task');

// Get all tasks for a project (for compatibility with frontend)
router.get('/:id/tasks', auth, async (req, res) => {
  try {
    const project = await Project.findOne({ _id: req.params.id, user: req.user.id });
    if (!project) return res.status(404).json({ message: 'Project not found.' });
    const tasks = await Task.find({ project: req.params.id });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// Delete a project and its tasks
router.delete('/:id', auth, async (req, res) => {
  try {
    console.log('[DELETE /api/projects/:id] Requested ID:', req.params.id, 'User ID:', req.user.id);
    const project = await Project.findOne({ _id: req.params.id, user: req.user.id });
    if (!project) {
      console.warn('[DELETE /api/projects/:id] Project not found for user:', req.user.id, 'Project ID:', req.params.id);
      return res.status(404).json({ message: 'Project not found for this user.' });
    }
    // Delete all tasks associated with this project
    await Task.deleteMany({ project: project._id });
    // Delete the project
    await Project.deleteOne({ _id: project._id });
    console.log('[DELETE /api/projects/:id] Project and tasks deleted for Project ID:', req.params.id);
    res.json({ message: 'Project deleted.' });
  } catch (err) {
    console.error('[DELETE /api/projects/:id] Error:', err);
    res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = router;
