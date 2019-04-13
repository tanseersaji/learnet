const express = require('express');
const adminController = require('../controllers/Admin');
const router = express.Router();
const {ensureAdminAuthenticated} = require('../helpers/Auth');

    
// Admin Register 
    router.post('/register',adminController.registerAdmin);
    
//Admin Login Form
    router.get('/',adminController.getLoginForm);

// Admin Dashboard
    router.get('/dashboard',ensureAdminAuthenticated,adminController.getAdminDashboard);

// Admin Login Post Request
    router.post('/login',adminController.getLoginAdmin);

// Admin Log Out 
    router.get('/logout',ensureAdminAuthenticated, adminController.getLogoutAdmin);

// Admin Courses 
    router.get('/courses',ensureAdminAuthenticated,adminController.getCourseList);

// Admin Create Course
    router.post('/create-course',ensureAdminAuthenticated,adminController.postCourse);

// Admin Create Course Form
    router.get('/create-course',ensureAdminAuthenticated,adminController.getCreateCourse);

// Admin Edit Course
    router.put('/edit/course/:id',ensureAdminAuthenticated,adminController.editCourse);

// Admin Get Course Detail Form
    router.get('/course/edit/:id',ensureAdminAuthenticated,adminController.getEditCourse);

// Admin Delete Course 
    router.delete('/course/delete/:id',ensureAdminAuthenticated,adminController.deleteCourse);

// Admin Create Chapter For Course
    router.post('/create-chapter/:id',ensureAdminAuthenticated,adminController.postChapter);

// Admin get Create Chapter Form
    router.get('/create-chapter/:id',ensureAdminAuthenticated,adminController.getChapter);

// Admin get Edit Chapter Form
    router.get('/chapter/edit/:id',ensureAdminAuthenticated,adminController.getEditChapter);

// Admin put Edit Chapter Request
    router.put('/chapter/edit/:id',ensureAdminAuthenticated,adminController.putChapter);

// Admin Delete Chapter Request
    router.delete('/chapter/delete/:id',ensureAdminAuthenticated,adminController.deleteChapter);

// Admin get Course Detail Page
    router.get('/course/:id',ensureAdminAuthenticated,adminController.getCourseDetail);
   
// Admin Api to get Course 
    router.get('/api/get/course',adminController.apiGetCourse);

// Admin Analytics of a Course
    router.get('/course/analytics/:id',ensureAdminAuthenticated,adminController.getAnalytics);

module.exports = router;