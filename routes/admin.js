const express = require('express');
const { auth, authorize } = require('../middleware/auth');
const { createUser, getUsers, updateUser, deleteUser, createCourse, getCourses, createTask, getTasks, updateTask, deleteTask } = require('../controllers/adminController');

const router = express.Router();

router.post('/users', auth, authorize('admin'), createUser);
router.get('/users', auth, authorize('admin'), getUsers);
router.put('/users/:id', auth, authorize('admin'), updateUser);
router.delete('/users/:id', auth, authorize('admin'), deleteUser);

const { upload } = require('../middleware/upload');

router.post('/courses', auth, authorize('admin'), createCourse);
router.get('/courses', auth, authorize('admin'), getCourses);

router.post('/tasks', auth, authorize('admin'), upload.array('files', 5), createTask);
router.get('/tasks', auth, authorize('admin'), getTasks);
router.put('/tasks/:id', auth, authorize('admin'), upload.array('files', 5), updateTask);
router.delete('/tasks/:id', auth, authorize('admin'), deleteTask);

module.exports = router;