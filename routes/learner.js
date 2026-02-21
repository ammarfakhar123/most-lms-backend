const express = require('express');
const { auth, authorize } = require('../middleware/auth');
const { upload } = require('../middleware/upload');
const { getTasks, submitTask, getLoginAttempts, updatePersonalDetails, getPersonalDetails, getResources } = require('../controllers/learnerController');

const router = express.Router();

router.get('/tasks', auth, authorize('learner'), getTasks);
router.post('/tasks/:id/submit', auth, authorize('learner'), upload.array('files', 5), submitTask);
router.get('/login-attempts', auth, authorize('learner'), getLoginAttempts);
router.get('/personal-details', auth, authorize('learner'), getPersonalDetails);
router.put('/personal-details', auth, authorize('learner'), updatePersonalDetails);
router.get('/resources', auth, authorize('learner'), getResources);

module.exports = router;