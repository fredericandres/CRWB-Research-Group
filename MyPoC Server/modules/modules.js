(function() {
  var r = require('rethinkdb'),
      connection;

  r.connect( {host: 'localhost', port: 28015}, function(err, conn) {
    if (err) throw err;
    connection = conn;
  });

  
  exports.crwbdl = function(req, res, next) {
    var presentation = req.body;
    var now = new Date().getTime();
    console.log(JSON.stringify(req.body));
    var array = [];
    if (presentation.timestamp){array.push(presentation.timestamp);}
    array.push({value : now, step : "crwbdl"});
    var dish = "dish"; //replace "dish" with the call to the DL service
    array.push({value : now, step : "dl_done"});
    presentation.timestamp = array;
    r.table('observation').insert(presentation).
        run(connection, function(err, result) {
          if (err) {console.log("ERROR: insert aborted");res.send(JSON.stringify({status: 'error'}));} else
          {res.send(JSON.stringify({status: 'ok',dishName: dish}));}
        });
  };
    
})();
