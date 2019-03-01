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

var sess;

app.use(function(req, res, next) {
   sess = req.session;
   if (sess.views) {
       sess.views++
   } 
   else {
       sess.views = 1
   }
   next();
   console.log(sess.views)
})

app.get('/admin', function(req, res){
    sess = req.session
	if(sess.email) {
		sess.isAuth = true;
		res.cookie('foo','bar')
		res.render('welcome',{email: sess.email})
		console.log(sess.isAuth)
	} else {
		res.render('admin',{ })	
	}
  
});
app.get('/', function(req, res){
	sess = req.session
	if(sess.isAuth){
		res.redirect('/admin');
	}
	else{
  	    res.render('form',{ })
	}
});

app.post('/admin',function(req,res,next){
    sess = req.session
    sess.email = req.body.email
    sess.password = req.body.password
	if(req.body.email !== '' && req.body.password === '240311') {
		sess.isAuth = true;
		res.cookie('foo','bar')
		res.render('welcome',{email: sess.email})
	}
	else {
		sess.isAuth = false;
		res.render('admin',{ })	
	}	 	
})
app.get('/logout', (req,res) => {
   req.session.destroy((err) => {
       if(err) {
           console.log(err);
       } else {
           res.redirect('/');
       }
   });
});


app.listen(8000)
console.log('Server is ready!');