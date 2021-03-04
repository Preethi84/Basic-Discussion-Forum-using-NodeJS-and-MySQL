/**
* Module dependencies.
*/
var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path'),
	busboy = require("then-busboy"),
    session = require('express-session'),
	fileUpload = require('express-fileupload'),
	app = express(),
	mysql      = require('mysql'),
	bodyParser=require("body-parser");
	
var connection = mysql.createConnection({
	multipleStatements: true,
	host     : 'localhost',
	user     : 'root',
	password : '',
	database : 'node_js'
});
 
connection.connect();
 
global.db = connection;
 
// all environments
app.set('port', process.env.PORT || 8080);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(fileUpload());

app.use(session({
	secret: 'keyboard cat',
	resave: false,
	saveUninitialized: true,
	cookie: { maxAge: 60000 }
  }))
 
// development only
 
app.get('/', routes.index);//call for main index page
app.get('/login', user.login);//call for signup page
app.post('/login', user.login);//call for signup post 
app.get('/tlogin', user.tlogin);//call for signup page
app.post('/tlogin', user.tlogin);//call for signup post 


app.get('/Register', routes.index);//call for login page
app.post('/Register', user.Register);//call for login post

app.get('/home/create',user.create);
app.post('/home/create',user.create);

app.get('/create_forum',user.create_forum);
app.post('/create_forum',user.create_forum);

app.get('/home/posts', user.posts);//call for dashboard page after login
app.get('/home/dashboard', user.dashboard);//call for dashboard page after login

app.get('/home/staff_dashboard', user.staff_dashboard);

app.get('/home/teacher_forum',user.teacher_forum);

app.get('/home/logout', user.logout);//call for logout
app.get('/home/profile',user.profile);//to render users profile
app.get('/home/display/:post_id', user.display); 
app.post('/home/comment/:post_id',user.comment);

app.get('/home/replies/:post_id',user.replies);

app.get('/home/delete/:post_id', user.delete_post);//edit customer route , get n post

app.get('/home/edit/:post_id',user.edit);

app.post('/home/edit/:post_id',user.save_edit);



//Middleware
app.listen(8080)
