const express = require('express');
const { auth, authorize } = require('../middleware/auth');
const { getTasks, reviewTask } = require('../controllers/iqaController');

const router = express.Router();

router.get('/tasks', auth, authorize('iqa'), getTasks);
router.post('/tasks/:id/review', auth, authorize('iqa'), reviewTask);

module.exports = router;