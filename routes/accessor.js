const express = require('express');
const { auth, authorize } = require('../middleware/auth');
const { getTasks, getSubmittedTasks, assessTask, getMyAssessments } = require('../controllers/accessorController');

const router = express.Router();

router.get('/tasks', auth, authorize('accessor'), getTasks);
router.get('/tasks/submitted', auth, authorize('accessor'), getSubmittedTasks);
router.get('/my-assessments', auth, authorize('accessor'), getMyAssessments);
router.post('/tasks/:id/assess', auth, authorize('accessor'), assessTask);

module.exports = router;