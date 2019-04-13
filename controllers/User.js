const admin = require('firebase-admin');

// Load User Model
    const User = require('../models/User');

// Load Course Model
    const Course = require('../models/Course');


function log(req){
    console.log(Date()+" | "+req.ip+" | "+req.method+" | "+req.url);
}

// User Dashboard
    exports.getDashbboard =  (req, res) => {
        log(req);
        var uid = req.session.userUid;
        console.log(uid)
        if (uid != undefined){
            admin.auth().getUser(uid).then(function(user){
            // console.log(user)
            User.findOne({email: req.session.userMail})
            .then(currentUser=>{
                if(currentUser){
                    Course.find( { _id : { $in : currentUser.courses } })
                    .then(userCourses=>{ 
                        res.render('dashboard', {user: user,courses:userCourses});
                    })
                }
            })
            }).catch(function(error){
                console.log("Error: "+error)
                res.redirect('/');
            });
        } else {
            res.redirect('/');
        }

    }
// User Firebase login
    exports.getFirebaseToken =  (req, res) => {
        var userUid = req.params.token;
        admin.auth().getUser(userUid)
        .then(function(userRecord) {
            User.findOne({email: userRecord.email})
                .then(user=>{
                    if(user){
                        console.log(userRecord.uid+" logged in to portal.");
                        req.session.userUid = userRecord.uid
                        req.session.userMail = userRecord.email
                        res.redirect('/dashboard');    
                }
                else{
                    const newUser = new User({
                        name: userRecord.displayName,
                        email: userRecord.email,
                        userUid: userRecord.uid
                    })
                    newUser.save()
                        .then(user=>{
                            console.log(user.userUid+" logged in to portal.");
                            req.session.userUid = user.userUid
                            req.session.userMail= user.email
                            res.redirect('/dashboard'); 
                        })
                }
                })
            
            
        })
        .catch(function(error) {
            console.log("Error fetching user data:", error);
            res.redirect('/');
        });
    }

// User Login / Authentication
    exports.getAuthentication =  (req, res) => {
        if (req.session.userUid != undefined){
        return   res.redirect('/dashboard');
        }
        res.render('auth');
        log(req)
    }
// User Logout
    exports.getLogout = (req, res) => {
        req.session.destroy(()=>{
            res.redirect('/');
        })
    }

// User Subscribe Course
    exports.subscribeCourse= (req,res)=>{
        User.findOne({email:  req.session.userMail})
            .then(user=>{
                Course.findOne({_id: req.params.id})
                .then(course=>{
                    user.courses.push(course)
                    user.save()
                    course.subscriber.push(user)
                    course.save()
                    .then(()=>{
                        res.redirect(`/course/${req.params.id}`)
                    })
                })
                .catch(err=>console.log(err))
            })
    }

    // User get Course Detail
exports.getChapterDetail = (req,res)=>{
    
    Course.findOne({_id: req.params.id})
    .then(course=>{
           User.findOne({email: req.session.userMail})
                .then(user=>{
                    if(user){
                        Course.find( { _id : { $in : user.courses } })
                        .then(userCourses=>{  
                            if(userCourses.filter(uCourses=>uCourses._id.toString() === req.params.id).length>0 || req.user){ 
                                 res.render('adminPanel/course',{layout: 'chapterPlayer',id:course._id,admin: req.user});
                            }
                            else{
                                res.redirect(`/course/${req.params.id}`)
                            }
                        })
                    }
                    else{
                        res.render('adminPanel/course',{layout: 'chapterPlayer',id:course._id,admin: req.user});
                    }
                })
        })
    }
    