
const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const auth = require('../middleware/auth');

// @route   GET /projects
// @desc    Get all projects for user
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const projects = await Project.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(projects);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /projects
// @desc    Create new project
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const { name, description, status } = req.body;
    
    const newProject = new Project({
      name,
      description,
      status: status || 'Planning',
      user: req.user.id
    });

    const project = await newProject.save();
    res.json(project);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /projects/:id
// @desc    Update project
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    const { name, description, status } = req.body;
    
    let project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check if project belongs to user
    if (project.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    project = await Project.findByIdAndUpdate(
      req.params.id,
      { name, description, status },
      { new: true }
    );

    res.json(project);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /projects/:id
// @desc    Delete project
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check if project belongs to user
    if (project.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await Project.findByIdAndDelete(req.params.id);
    res.json({ message: 'Project removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;


