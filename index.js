var express = require('express')
var session = require('express-session')
var cookieParser = require('cookie-parser')
bodyParser = require('body-parser')
var app = express()
var urlencodedParser = bodyParser.urlencoded({ extend: false})
var router = express.Router()


app.set('views', './views')
app.set('view engine', 'ejs')
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));

app.use(session({ secret: 'keyboard cat', cookie: { maxAge: 60000}, resave : false, saveUninitialized:false}))


app.use(function(req, res, next) {
   var sess = req.session;
   if (sess.views) {
       sess.views++
   } 
   else {
       sess.views = 1
   }
   next();
   console.log(sess.views)
})
app.get('/login', function(req, res){	
   var sess = req.session 
   sess.isAuth = false;
   sess.views = 1
   res.render('login',{})
})

app.get('/', function(req, res){
	var sess = req.session
	console.log(sess.isAuth)
	if(sess.isAuth) {
		res.redirect('/welcome')
	} else {
		res.render('form',{})	
	}
  
});

app.get('/welcome', function(req, res, next) {
	var sess = req.session;

})

app.post('/',function(req,res,next){
	var sess = req.session
	if(req.body.email === '' || req.body.password !== '240311'){
		res.redirect('/login');
	}	 	
	else {
		sess.isAuth = true;
		res.cookie('foo','bar')
		res.render('welcome',{
		email: req.body.email,
		password: req.body.password
	    }) 
	}
})

app.listen(8000)
console.log('Server is ready!');
