const express = require('express');
const { auth, authorize } = require('../middleware/auth');
const { getTasks, reviewTask } = require('../controllers/eqaController');

const router = express.Router();

router.get('/tasks', auth, authorize('eqa'), getTasks);
router.post('/tasks/:id/review', auth, authorize('eqa'), reviewTask);

module.exports = router;