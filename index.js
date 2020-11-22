var jsonServer = require('json-server');
var server = jsonServer.create();
var router = jsonServer.router('db.json');
var middlewares = jsonServer.defaults();
var port = Number(process.env.PORT || 3000);

//yaha se
const bodyParser = require('body-parser');
server.use(bodyParser.json());

var db = require('./db.json');

function isAuthenticated({username, password}){
  return db.users.findIndex(user => user.username === username && user.password === password) !== -1
}

server.post('/users/login', (req, res) => {
  console.log("login endpoint called; request body:");
  console.log(req.body);
  const {username, password} = req.body;
  if (isAuthenticated({username, password}) === false) {
    res.statusCode = 401;
    res.setHeader('Content-Type', 'application/json');
    res.json({success: false, status: 'Login Unsuccessful', err: 401});
  }
  //const access_token = createToken({username, password})
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.json({success: true, status: 'Login Successful', token: "7iuh78yh" });
})
//yaha tak

server.use(middlewares);
server.use(router);
server.listen(port, function () {
    console.log('JSON Server is running')
});
