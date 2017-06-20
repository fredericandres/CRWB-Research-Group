var express = require('express'),
    module = require('./modules/modules'),
    app = express();


app.use(express.bodyParser());
///////////////////////////////////
//Enable CORS
app.use(function(request, response, next) {
  response.header("Access-Control-Allow-Origin", "*");
  response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
app.options('/api/*', function (request, response, next) {
    response.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, OPTIONS");
    response.send();
});
///////////////////////////////////

app.post('/crwbdl',module.crwbdl);

//Following functions are insecure and you need to replace "module = require('./modules/modules')" with "module = require('./modules/modules_old')"
/*
app.get('/table/:table', module.findAll);
app.get('/table/:table/:id', module.findById);
app.post('/table/:table', module.create);
app.delete('/table/:table/:id', module.delete);
app.put('/table/:table/:id', module.update);
app.get('/tableCreate/:table', module.createTable);
*/

app.listen(80);
console.log('Listening on port 80...');