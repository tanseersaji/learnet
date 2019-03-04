const Express = require('express');
const path = require('path');

const app = Express()
app.set('view engine', 'pug')
app.use(Express.static('static'))

app.get('/', function (req, res){
    res.render('homepage');
    console.log(req.ip+" "+req.method+" "+req.url);
});

var host = 'localhost';
var port = 8000

app.listen(port, host, () => console.log(`Server started at http://${host}:${port}`));