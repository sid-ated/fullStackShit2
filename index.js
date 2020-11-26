var jsonServer = require('json-server');
var server = jsonServer.create();
var router = jsonServer.router('db.json');
var middlewares = jsonServer.defaults();
var port = Number(process.env.PORT || 3000);
server.use(middlewares);
//var serverAuth = require('./serverAuth');
//server.use('/auth', serverAuth);
server.get('/auth', (req, res) => {
res.status(200).jsonp("I AM WOORKING")
})
server.use(router);
server.listen(port, function () {
    console.log('JSON Server is running')
});
