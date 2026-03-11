const express = require('express');
const router = express.Router();
const TeamMember = require('../models/TeamMember');

// @route   GET /api/team
// @desc    Get all team members
// @access  Public
router.get('/', async (req, res) => {
  try {
    const teamMembers = await TeamMember.find().sort({ createdAt: -1 });
    res.json(teamMembers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/team
// @desc    Add new team member
// @access  Public
router.post('/', async (req, res) => {
  try {
    const { name, email, role } = req.body;

    // Check if email already exists
    const existingMember = await TeamMember.findOne({ email });
    if (existingMember) {
      return res.status(400).json({ message: 'Team member with this email already exists' });
    }

    const newTeamMember = new TeamMember({
      name,
      email,
      role
    });

    const teamMember = await newTeamMember.save();
    res.json(teamMember);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/team/:id
// @desc    Update team member
// @access  Public
router.put('/:id', async (req, res) => {
  try {
    const { name, email, role } = req.body;

    let teamMember = await TeamMember.findById(req.params.id);

    if (!teamMember) {
      return res.status(404).json({ message: 'Team member not found' });
    }

    // Check if email is being changed and if it already exists
    if (email !== teamMember.email) {
      const existingMember = await TeamMember.findOne({ email });
      if (existingMember) {
        return res.status(400).json({ message: 'Team member with this email already exists' });
      }
    }

    teamMember = await TeamMember.findByIdAndUpdate(
      req.params.id,
      { name, email, role },
      { new: true }
    );

    res.json(teamMember);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/team/:id
// @desc    Delete team member
// @access  Public
router.delete('/:id', async (req, res) => {
  try {
    const teamMember = await TeamMember.findById(req.params.id);

    if (!teamMember) {
      return res.status(404).json({ message: 'Team member not found' });
    }

    await TeamMember.findByIdAndDelete(req.params.id);
    res.json({ message: 'Team member removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

