const Express = require('express');
const Courses = require('./courseList');
const admin = require('firebase-admin');

const app = Express()
app.set('view engine', 'pug')
app.use(Express.static('static'))

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

app.get('/auth', (req, res) => {
    res.render('auth');
    log(req)
});
app.get('/auth/_/:token', (req, res) => {
    console.log(req.params.token);
    var uid = req.params.token;
    admin.auth().getUser(uid)
    .then(function(userRecord) {
        // See the UserRecord reference doc for the contents of userRecord.
        console.log("Successfully fetched user data:", userRecord.toJSON());
    })
    .catch(function(error) {
        console.log("Error fetching user data:", error);
    });

    res.send('Redirecting in 5 seconds');
});

app.get('*', function(req, res){
    res.status(404).render('404')
});

var host = 'localhost';
var port = 8080

app.listen(port, host, () => console.log(`Server started at http://${host}:${port}`));