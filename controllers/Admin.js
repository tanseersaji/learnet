const Admin = require('../models/Admin');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const Course = require('../models/Course');
const Chapter = require('../models/Chapter');
const User = require('../models/User');


// Register Controller
exports.registerAdmin= (req,res)=>{
    Admin.findOne({email: req.body.email})
        .then(admin=>{
            if(admin){
                return res.status(400).json({msg: 'Admin Already Exists'})
            }
            else{
                const newAdmin = new Admin ({
                    name: req.body.name,
                    email: req.body.email,
                    password: req.body.password
                }) 
                bcrypt.genSalt(10,(err,salt)=>{
                    bcrypt.hash(newAdmin.password,salt,(err,hash)=>{
                          if(err) throw err;
                          newAdmin.password = hash;
                          newAdmin.save()
                          .then(admin=>res.json(admin))
                          .catch(err=>console.log(err))
                    })
                }) 
            }
        })
}

// Login Controller
exports.getLoginAdmin = (req,res,next)=>{
        passport.authenticate('local',{
            successRedirect:'/ln-admin/dashboard',
            failureRedirect: '/ln-admin'
        })(req,res,next);
    }


// Logout Controller
exports.getLogoutAdmin= (req,res)=>{
    req.session.destroy(()=>{
        res.redirect('/ln-admin');
   })
}

// LoginForm Controller
exports.getLoginForm = (req,res)=>{
    if(req.user){
        res.redirect('/ln-admin/dashboard')
    }
    else{    
        res.render('adminPanel/login', { layout: 'admin' });
    }
}

// Admin Dash Board Controller
exports.getAdminDashboard = (req,res)=>{
    Course.find({})
        .sort({cid: 'desc'})
        .then(courses=>{    
            res.render('adminPanel/home', { layout: 'admin',user: req.user,courses:courses});
        })
}

// Admin Get Course List 
    exports.getCourseList= (req,res)=>{
        Course.find({})
        .sort({cid: 'desc'})
        .then(courses=>{
            res.render('adminPanel/courses',{layout: 'admin', courses: courses})
        })
    }

// Admin Get Create Course Form
exports.getCreateCourse= (req,res)=>{
    res.render('adminPanel/addCourse', { layout: 'admin' });
}

// Admin Create Course 
exports.postCourse = (req,res)=>{
    Course.findOne({cid: req.body.cid})
        .then(course=>{
            if(course){
               console.log('Already Exist karta hai yea')
            }
            else{
                const newCourse = new Course({
                    cid: req.body.cid,
                    title: req.body.title,
                    description: req.body.description,
                    prize: req.body.prize,
                    thumbUrl: req.body.thumbUrl,
                    objective: req.body.objective,
                    isPublic: req.body.isPublic,
                    duration: req.body.duration
                })
                    const outcomes ={
                        outcome:req.body.outcome

                    }
                newCourse.outcomes.push(outcomes)
                newCourse.save()
                res.redirect(`/ln-admin/create-chapter/${newCourse._id}`)
            }
        })


}
// Admin Get course Detail 
    exports.getCourseDetail = (req,res)=>{
        res.cookie('currentCourse', `${req.params.id}`)
        Course.findOne({_id:req.params.id})
        .then(course=>{
            Chapter.find( { _id : { $in : course.syllabus } })
            .sort({chid:'ascending'})
            .then(chapter=>{
                res.render('coursedetail',{layout: 'main',course:course, chapter:chapter,currentAdmin: req.user});
            })
        })
    }
// Admin Edit Course 
    exports.editCourse = (req,res)=>{
        Course.findOne({_id: req.params.id})
            .then(course=>{
                if(course){
                    course.cid = req.body.cid;
                    course.title = req.body.title;
                    course.description = req.body.description;
                    course.prize = req.body.prize;
                    course.thumbUrl = req.body.thumbUrl;
                    course.objective = req.body.objective;
                    course.outcomes[0].outcome = req.body.outcome;
                    course.isPublic = req.body.isPublic;
                    course.duration = req.body.duration
                    course.save()
                        .then(course=>{
                            res.redirect('/ln-admin/course/edit/'+course.id)
                        })
                }
                else{
                    console.log("Course Didn't found")
                }
            })
    }
// Admin Get Edit Course 
    exports.getEditCourse = (req,res)=>{
        Course.findOne({_id: req.params.id})
            .then(course=>{
                if(course){
                    Chapter.find( { _id : { $in : course.syllabus } })
                    .sort({chid:'ascending'})
                    .then(chapters=>{
                        res.render('adminPanel/editCourse',{layout: 'admin',course: course, chapter: chapters })
                    })
                                                         
                }
                else{
                    console.loge('Course Not Found')
                }
            })
    }
// Admin Delete Course
    exports.deleteCourse= (req,res)=>{
        Course.findOne({_id: req.params.id})
        .then(course=>{
            if(course){
                Chapter.deleteMany( { _id : { $in : course.syllabus } }).then(()=>{
                     Course.deleteOne({_id: req.params.id})
                     .then(()=>{
                         res.redirect('/ln-admin/courses')
                     })
                })
                
            }
            else{
                console.loge('Course Not Found')
            }
        })
            
    }
// Admin Create Chapter for course
    exports.postChapter = (req,res)=>{
        Course.findOne({_id: req.params.id })
            .then(course=>{ 
                const newChapter= new Chapter({
                chid: req.body.chid,
                title: req.body.title,
                description: req.body.description,
                chapterType: req.body.chapterType
            })
            if(req.body.chapterType ==="Video"){
                const videoDetail = {
                    videoTitle: req.body.videoTitle ,
                    watchId: req.body.watchId
                }
                newChapter.video.push(videoDetail)
                newChapter.quiz.push(null)
            }
            if(req.body.chapterType === "Quiz"){
               
                const quizDetail = {
                    questionText: req.body.questionText,
                    options:req.body.options,
                    solution: req.body.solution
                }
                newChapter.quiz.push(quizDetail)
                newChapter.video.push(null)
            }
            newChapter.save()
            course.syllabus.push(newChapter)
            course.save()
            
            res.redirect('/ln-admin/course/edit/'+req.params.id)
            
              
            })
    }

// Admin Get Chapter Form
    exports.getChapter = (req,res)=>{
         res.render('adminPanel/addChapter', { layout: 'admin' , id:req.params.id});
    }

// Admin Edit Chapter Form
    exports.getEditChapter = (req,res)=>{
        Chapter.findOne({_id: req.params.id})
            .then(chapter=>{       
                res.render('adminPanel/editChapter', { layout: 'admin' , chapter:chapter});
            })
    }

// Admin Put edit Chapter 
    exports.putChapter = (req,res)=>{
        Chapter.findOne({_id: req.params.id})
            .then(chapter=>{
                chapter.chid  = req.body.chid;
                chapter.title = req.body.title;
                chapter.description = req.body.description;
                if(chapter.chapterType ==="Video"){
                    chapter.video[0].videoTitle= req.body.videoTitle
                    chapter.video[0].watchId= req.body.watchId
                }
                if(chapter.chapterType === "Quiz"){
                    chapter.quiz[0].questionText= req.body.questionText;
                    chapter.quiz[0].options=req.body.options;
                    chapter.quiz[0].solution= req.body.solution;
                   
                }
                
                chapter.save()
                .then(chapter=>{
                    res.render('adminPanel/editChapter', { layout: 'admin' , chapter:chapter});
                })
            })
    }

// Admin Delete Chapter
    exports.deleteChapter = (req,res)=>{
        const id = req.cookies.currentCourse;
        Course.updateOne({_id:id},{$pull:{ syllabus: {_id: req.params.id}}},(err,obj)=>{
            Chapter.deleteOne({_id: req.params.id})
            .then(()=>{    
                res.redirect(`/ln-admin/course/edit/${id}`)
            })
        })

    }

// Admin Api to get Course 
    exports.apiGetCourse = (req,res)=>{
        const id = req.cookies.currentCourse;
        Course.findOne({_id:id})
    .then(course=>{
        if(course){
            Chapter.find( { _id : { $in : course.syllabus } })
            .sort({chid:'ascending'})
            .then(chapters=>{
                return res.json({
                    course: course,
                    chapters: chapters
                })
            })
                                                 
        }
        else{
            console.log('Course Not Found')
        }
    })
    }
// Admin Get Analytics of a Course
    exports.getAnalytics= (req,res)=>{
        Course.findOne({_id: req.params.id})
            .then(course=>{
                if(course){  
                    User.find( { _id : { $in : course.subscriber } })
                    .then(students=>{
                          res.render('adminPanel/courseAnalytics', { layout: 'admin',course:course,students:students, number_of_students:course.subscriber.length, number_of_chapters: course.syllabus.length });
                    })  
                }})
    }