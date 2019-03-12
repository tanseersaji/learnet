const Express = require('express');
const Courses = require('./courseList');
const admin = require('firebase-admin');
var cookieParser = require('cookie-parser');

const app = Express()
app.set('view engine', 'pug')
app.use(Express.static('static'))
app.use(cookieParser())

var serviceAccount = require("./firebaseCred.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://learneteducation-44.firebaseio.com"
});

function log(req){
    console.log(Date()+" | "+req.ip+" | "+req.method+" | "+req.url);
}

app.get('/', function (req, res){
    res.render('homepage', {courses: Courses.coursesList});
    log(req);
});

app.get('/about', function (req, res){
    res.render('about', {courses: Courses.coursesList});
    log(req);
});

app.get('/courses', function (req, res){
    cid = req.query.id;
    if (cid != undefined){
        var course = Courses.coursesList[cid-1];
        res.render('coursedetail', {topCourse: course});
    } else {
        res.render('coursedetail',{
            topCourse: Courses.coursesList[0],
            courses: Courses.coursesList.slice(1)
        });
    }
    log(req);
});

app.get('/dashboard', (req, res) => {
    log(req);
    var uid = req.cookies.uid;
    if (uid != undefined){
        admin.auth().getUser(uid).then(function(user){
            res.render('dashboard', {user: user});
        }).catch(function(error){
            console.log("Error: "+error)
            res.redirect('/');
        });
    } else {
        res.redirect('/');
    }

});

app.get('/auth', (req, res) => {
    if (req.cookies.uid != undefined){
        res.redirect('/dashboard');
    }
    res.render('auth');
    log(req)
});
app.get('/auth/_/:token', (req, res) => {
    var uid = req.params.token;
    admin.auth().getUser(uid)
    .then(function(userRecord) {
        var expiryDate = new Date(Date.now() + 2592000000);
        console.log(userRecord.uid+" logged in to portal.");
        res.cookie("uid",userRecord.uid,{expires: expiryDate})
        .redirect('/dashboard');
    })
    .catch(function(error) {
        console.log("Error fetching user data:", error);
        res.redirect('/');
    });
});

app.get('/logout', (req, res) => {
    res.clearCookie('uid').redirect('/');
});

app.get('*', function(req, res){
    res.status(404).render('404')
});

var host = 'localhost';
var port = 8080

app.listen(port, host, () => console.log(`Server started at http://${host}:${port}`));