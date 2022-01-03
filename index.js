//* Student Profile Portal Application for Zoho*/

/* Authentication Using Google Aouth2.0  Passport Strategy
a.	Node JS 
b.  MongoDB
c.  Javascript ES6 
d.	CSS-3
/*developed by Parvathi Sankari on Parvathi on 06-Dec-2021 */


//Initilaise the reuired dependecies
const express = require('express');
const session = require('express-session');
const passport = require('passport');
var bodyParser=require("body-parser")
var mongoose = require("mongoose")
const multer = require("multer")
const path = require("path")

 require('./authsa');

 function isLoggedIn(req, res, next) {
    req.user ? next() : res.sendStatus(401);
  }

  const app = express();

//Middleware

app.use(session({ secret: 'cats',resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.json())
app.use(express.static('public'))
app.use(bodyParser.urlencoded({extended:true }))


mongoose.connect('mongodb://localhost:27017/mydb',{
    useNewUrlParser: true,
    useUnifiedTopology: true
});

var db = mongoose.connection;

db.on('error',()=>console.log("Error in Connecting to Database"));
db.once('open',()=>console.log("Connected to Database"))

var storage = multer.diskStorage({
  destination: function (req, file, cb) {

      // Uploads is the Upload_folder_name
      cb(null, "uploads")
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "-" + Date.now()+".jpg")
  }
})

//whenever user visits the url, google link to login
app.get('/', (req, res) => {
    res.send('<a href="/auth/google">Authenticate with Google</a>');
  });


//users will be authneticated by Google
app.get('/auth/google', passport.authenticate('google', { scope: ['email', 'profile'] }
));

app.get('/auth/google/callback',
  passport.authenticate('google', {
    successRedirect: '/protected',
    failureRedirect: '/auth/google/failure'
  })
);

app.get('/protected',isLoggedIn, (req, res) => {
    res.send('<a href = "welcome.html"> Click here for Zoho Student Portal </a>');
    
  });
  
app.get('/logout', (req, res) => {
    req.logout();
    req.session.destroy();
    res.send('Goodbye!');
  });

app.get('/auth/google/failure', (req, res) => {
  res.send('Failed to authenticate..');
});

app.post("/sign_up",(req,res)=>{
  var name = req.body.name;
  var email = req.body.email;
  var phone = req.body.phone;
  var password = req.body.password;
  var department= req.body.department;
  var skills = req.body.skills;

  var data = {
      "name": name,
      "email" : email,
      "phone": phone,
      "password" : password,
      "department" : department,
      "skills"  : skills
  }

db.collection('users').insertOne(data,(err,collection)=>{
      if(err){
          throw err;
      }
      console.log("Record Inserted Successfully");
  });
return res.redirect('signup_success.html')
})

// Define the maximum size for uploading
// file i.e. 1 MB. it is optional
const maxSize = 1 * 1000 * 1000;
    
var upload = multer({ 
    storage: storage,
    limits: { fileSize: maxSize },
    fileFilter: function (req, file, cb){
    
        // Set the filetypes, it is optional
        var filetypes = /jpeg|jpg|pdf|doc|png/;
        var mimetype = filetypes.test(file.mimetype);
  
        var extname = filetypes.test(path.extname(
                    file.originalname).toLowerCase());
        
        if (mimetype && extname) {
            return cb(null, true);
        }
      
        cb("Error: File upload only supports the "
                + "following filetypes - " + filetypes);
      } 
  
// myprofile is the name of file attribute
}).single("myprofile");       
  
app.get("/",function(req,res){
    res.render("Signup");
})
    
app.post("/uploadProfile",function (req, res, next) {
        
    // Error MiddleWare for multer file upload, so if any
    // error occurs, the file would not be uploaded!
    upload(req,res,function(err) {
  
        if(err) {
  
            // ERROR occurs due to uploading file of size greater than
            // 1MB or uploading different file type)
            res.send(err)
        }
        else {
  
            // SUCCESS, file successfully uploaded
                       res.send("Thank you !! Your Profile is uploaded!")
        }
    })
})

app.listen(5000, () => console.log('listening on port: 5000'));

/* End of Program */
