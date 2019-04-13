const express = require('express');
const router = express.Router();
const userController = require('../controllers/User');

const {ensureStudentAuthenticated} = require('../helpers/Auth');

// User Dashboard
    router.get('/dashboard',ensureStudentAuthenticated,userController.getDashbboard);

//User Authentication / Login
    router.get('/auth', userController.getAuthentication);

// User Auth token
    router.get('/auth/_/:token',userController.getFirebaseToken);

// User Login
    router.get('/logout',ensureStudentAuthenticated, userController.getLogout);

// User Subscribe Courses
    router.post('/subscribe/course/:id',ensureStudentAuthenticated,userController.subscribeCourse);
   

// User  Course Detail
router.get('/course/chapters/:id',ensureStudentAuthenticated,userController.getChapterDetail);

module.exports = router;