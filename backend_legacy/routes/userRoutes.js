const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// All routes are prepended with /api/v1/users in index.js
router.get('/profile', userController.getUserProfile);
router.put('/profile', userController.updateUserProfile);

router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUserById);
router.post('/', userController.createUser);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);

module.exports = router;
