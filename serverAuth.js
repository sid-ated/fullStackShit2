const fs = require('fs')
const bodyParser = require('body-parser')
const jsonServer = require('json-server')
const jwt = require('jsonwebtoken')
const fetch = require('node-fetch')
const serverAuth = jsonServer.create()

serverAuth.use(bodyParser.urlencoded({extended: true}))
serverAuth.use(bodyParser.json())
serverAuth.use(jsonServer.defaults());

const SECRET_KEY = '123456789'

const expiresIn = '1h'

// Create a token from a payload 
function createToken(payload){
  return jwt.sign(payload, SECRET_KEY, {expiresIn})
}

// Verify the token 
function verifyToken(token){
  return  jwt.verify(token, SECRET_KEY, (err, decode) => decode !== undefined ?  decode : err)
}

async function getapi(url) { 
    
    // Storing response 
    const response = await fetch(url); 
    
    // Storing data in form of JSON 
    var data = await response.json(); 
    //console.log(data); 
    
    return data;
} 

serverAuth.get('/temp', (req, res) => {
let url = "https://aichemist-server.herokuapp.com/users";
fetch(url)
.then((resp) => resp.json()) 
.then(function(data) {
  console.log(data)
})
res.status(200).jsonp("working");
});

// Check if the user exists in database
function isAuthenticated({username, password}){
fetch("https://aichemist-server.herokuapp.com/users")
.then((resp) => resp.json()) 
.then(function(data) {
  return data.findIndex(user => user.username === username && user.password === password) !== -1
})
}

// Register New User
serverAuth.post('/register', (req, res) => {
  console.log("register endpoint called; request body:");
  console.log(req.body);
  const {username, password} = req.body;
  var okay = isAuthenticated({username, password});
  if(isAuthenticated({username, password}) === true) {
    res.statusCode = 401;
    res.setHeader('Content-Type', 'application/json');
    res.json({success: false, status: 'This user already exist', err: 401});
  }
else{
	fetch("https://aichemist-server.herokuapp.com/users")
	.then((resp) => resp.json()) 
	.then(function(data) {
	  var last_item_id = data[data.length-1].id;
	  //data.push({id: last_item_id + 1, username: username, password: password, isAdmin: false});
		    fetch("https://aichemist-server.herokuapp.com/users", { 
		      
		    // Adding method type 
		    method: "POST", 
		      
		    // Adding body or contents to send 
		    body: JSON.stringify({
		     id: last_item_id +1,
		     username: username,
		     password: password,
		     isAdmin: false
		    }
		    ), 
		      
		    // Adding headers to the request 
		    headers: { 
			"Content-type": "application/json; charset=UTF-8"
		    } 
		}) 
		.then(response => response.json()) 
  
		// Displaying results to console 
		.then(json => console.log(json)); 
	})

// Create token for new user
  const access_token = createToken({username, password})
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.json({success: true, status: 'Registration Successful! You are loged in.', token: access_token });
  }
})

// Login to one of the users from ./users.json
serverAuth.post('/login', (req, res) => {
  console.log("login endpoint called; request body:");
  console.log(req.body);
  const {username, password} = req.body;
  if (isAuthenticated({username, password}) === false) {
    res.statusCode = 401;
    res.setHeader('Content-Type', 'application/json');
    res.json({success: false, status: 'Login Unsuccessful', err: 401});
  }
  else{
	  const access_token = createToken({username, password})
	  res.statusCode = 200;
	  res.setHeader('Content-Type', 'application/json');
	  res.json({success: true, status: 'Login Successful', token: access_token });
  }
})

serverAuth.use(/^(?!\/auth).*$/,  (req, res, next) => {
  if (req.headers.authorization === undefined || req.headers.authorization.split(' ')[0] !== 'Bearer') {
    res.statusCode = 401;
    res.setHeader('Content-Type', 'application/json');
    res.json({success: false, status: 'Error in authorization', err: 401});
  }
  try {
    let verifyTokenResult;
     verifyTokenResult = verifyToken(req.headers.authorization.split(' ')[1]);

     if (verifyTokenResult instanceof Error) {
       res.statusCode = 401;
    res.setHeader('Content-Type', 'application/json');
    res.json({success: false, status: 'Access token not provided', err: 401});
     }
     next()
  } catch (err) {
    res.statusCode = 401;
    res.setHeader('Content-Type', 'application/json');
    res.json({success: false, status: 'Login Unsuccessful', err: err});
  }
})


module.exports = serverAuth;
