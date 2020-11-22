var jsonServer = require('json-server');
var server = jsonServer.create();
var router = jsonServer.router('db.json');
var middlewares = jsonServer.defaults();
var port = Number(process.env.PORT || 3000);
var db = require('./db.json');
server.use(middlewares);
server.use(router);
server.listen(port, function () {
    console.log('JSON Server is running')
});
