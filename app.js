var express = require('express');
var app = express();
var ejs = require('ejs');
var mysql = require('mysql');
var session = require('express-session');
var bodyParser = require('body-parser');
var path = require('path');
app.use(bodyParser.urlencoded({ extended: true })); 
var TABLE='form';
var mysql = mysql.createConnection({
host: 'localhost',
user:'root',
password: 'simmi1100',
database: 'login'
});
mysql.connect();
 
global.db = mysql;
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
              secret: 'keyboard cat',
              resave: false,
              saveUninitialized: true,
              cookie: { maxAge: 60000 }
            }))
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.get('/signup',function(req,res,next){
res.sendfile('views/signup.html');
});
app.post( '/signup',function(req, res) {
console.log('req.body');
console.log(req.body);


var query=mysql.query("Insert into "+TABLE+" (username,pwd,dob) VALUES ('"+req.body.username+"','"+req.body.pwd+"','"+req.body.dob+"')",
function(err, result)      
{                                                      
   if (err)
      throw err;
   else 
      res.sendfile('views/signup.html');
});
});
app.get('/signup',function(req,res,next){
res.sendfile('views/signup.html');
});
app.post('/signup', function(req, res) {
console.log('req.body');
console.log(req.body);

var message='';
var query=mysql.query("Insert into "+TABLE+" (username,pwd,dob) VALUES ('"+req.body.username+"','"+req.body.pwd+"','"+req.body.dob+"')",
function(err, result)      
{                                                      
   if (err)
      throw err;
   else 
      message = "Succesfully! Your account has been created.";
        
         res.render('signup.html',{message: message});
});
});
app.get('/login',function(req,res,next){
res.sendfile('views/index.html');
});
app.post('/login', function(req, res) {
console.log(req.body);
 var sess = req.session;
var post  = req.body;
      var name= post.username;
      var pass= post.pwd;
     
var query=mysql.query("SELECT id,username,dob FROM `form` WHERE `username`='"+name+"' and pwd = '"+pass+"'" ,
function(err, results)      
{                                                      
    if(results.length){
            req.session.userId = results[0].id;
            req.session.user = results[0];
            console.log(results[0].id);
            res.redirect('/home/dashboard');
         }
         else{
            message = 'Wrong Credentials.';
            res.render('index.html',{message: message});
    }
                 
  });
});
app.get('/home/dashboard', function(req, res, next){
           
   var user =  req.session.user,
   userId = req.session.userId;
   console.log('ddd='+userId);
   if(userId == null){
      res.redirect("/login");
      return;
   }

   var sql="SELECT * FROM `form` WHERE `id`='"+userId+"'";

   db.query(sql, function(err, results){
      res.render('dashboard.html', {user:user});    
   });       
});
app.get('/home/logout', function(req,res){
   req.session.destroy(function(err) {
      res.redirect("/login");
   })
});
app.get('/home/profile',function(req, res){

   var userId = req.session.userId;
   if(userId == null){
      res.redirect("/login");
      return;
   }

   var sql="SELECT * FROM `form` WHERE `id`='"+userId+"'";          
   db.query(sql, function(err, result){  
      res.render('profile.html',{data:result});
   });
});
app.listen(3000);
console.log('Example app listening at port:3000');
