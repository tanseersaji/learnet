const Express = require('express');
const Courses = require('./courseList');
const admin = require('firebase-admin');
const expHbs = require('express-handlebars');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const MongoDbStore = require('connect-mongodb-session')(session);
const passport = require('passport');
const methodOverride = require('method-override');
var cookieParser = require('cookie-parser');

const Course = require('./models/Course');
const Chapter = require('./models/Chapter');

// Load User Model
const User = require('./models/User');




const app = Express();

// Cookie Parser Middleware
    app.use(cookieParser());

// Load Routes
    const adminRoutes = require('./routes/Admin');
    const UserRoutes = require('./routes/User');

// Passport Config
    require('./config/passport')(passport);

// Connecting MongoDb Databse
    mongoose.connect('mongodb+srv://learnnet_team:learnetTeamTSS@cluster0-2ywhe.mongodb.net/test?retryWrites=true',{useNewUrlParser:true})
        .then(()=>console.log('MongoDB successfully connected'))
        .catch(err=>console.log('Error'+err))

        const store = new MongoDbStore ({uri:'mongodb+srv://learnnet_team:learnetTeamTSS@cluster0-2ywhe.mongodb.net/test?retryWrites=true',
        collection: 'sessions' 
    })
    
// Handlebars Middleware
    const hbs = expHbs.create({
        partialsDir: [
            'views/partials/'
        ]
    });
    app.engine('handlebars',expHbs({
      
        defaultLayout: 'main'
    }), hbs.engine)
    app.set('view engine', 'handlebars') 
    app.use(Express.static('static'))


// BodyParser Middleware
    app.use(bodyParser.urlencoded({extended: false}))
    app.use(bodyParser.json())

// Method Overide Middleware
    app.use(methodOverride('_method'))

// Express Session Middleware
    app.use(session({secret: 'wubba lubba dub dub', resave: false, saveUninitialized: false, store : store}));

// Passport Middleware
    app.use(passport.initialize());
    app.use(passport.session());

// Global Variables
    app.use((req,res,next)=>{
        res.locals.userUid = req.session.userUid || null;
        next();
    })

// Firebase Middleware
    var serviceAccount = require("./firebaseCred.json");

    admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://learneteducation-44.firebaseio.com"
    });

    function log(req){
        console.log(Date()+" | "+req.ip+" | "+req.method+" | "+req.url);
    }

// HomePage Routes
    app.get('/', function (req, res){
        Course.find({isPublic:true})
        .limit(3)
        .sort({cid:'ascending'})
        .then(course=>{
            res.render('homepage', {layout: 'main',courses: course});
        })
        log(req);
    });

    app.get('/about', function (req, res){
        Course.find({})
        .limit(3)
        .sort({cid: 'desc'})
        .then(courses=>{
            
        res.render('about', {layout: 'main',courses: courses});
        })
        log(req);
    });

    app.get('/course/:id', function (req, res){
        
        res.cookie('currentCourse', `${req.params.id}`);

        Course.findOne({_id:req.params.id})
        .then(course=>{
            Chapter.find( { _id : { $in : course.syllabus } })
            .sort({chid:'ascending'})
            .then(chapter=>{
                User.findOne({email: req.session.userMail})
                .then(user=>{
                    if(user){
                        Course.find( { _id : { $in : user.courses } })
                        .then(userCourses=>{  
                            if(userCourses.filter(uCourses=>uCourses._id.toString() === req.params.id).length>0){
                                 res.render('coursedetail',{layout: 'main',course:course, chapter:chapter,currentAdmin: req.user, userSubcribed:true});
                            }
                            else{
                                
                            res.render('coursedetail',{layout: 'main',course:course, chapter:chapter,currentAdmin: req.user,userSubcribed:null});
                            }
                        })
                    }
                    else{
                        res.render('coursedetail',{layout: 'main',course:course, chapter:chapter,currentAdmin: req.user})
                    }
        })
            })
        })
        
       
        log(req);
    });

// Coures List
app.get('/courses', function (req, res){
    Course.find({})
    .sort({cid: 'desc'})
    .then(courses=>{
        res.render('coursesList',{layout: 'main',courses:courses})
    })
   
    log(req);
});

// User Routes
    app.use(UserRoutes);

// Admin Routes
    app.use('/ln-admin',adminRoutes);

//  404 Routes
    app.get('*', function(req, res){
        res.status(404).render('404')
    });

    var host = 'localhost';
    var port = 8080

    app.listen(port, host, () => console.log(`Server started at http://${host}:${port}`));