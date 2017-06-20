(function() {
  var r = require('rethinkdb'),
      connection;

  r.connect( {host: 'localhost', port: 28015}, function(err, conn) {
    if (err) throw err;
    connection = conn;
  });

  exports.findAll = function(req, res) {
    var table = req.params.table;
    r.table(table).run(connection, function(err, cursor) { 
       if (err){res.send(null)}else{
        cursor.toArray(function(err, result) {
            if (err) throw err;
            res.send(JSON.stringify(result, null, 2));
        });
	}
    });
  };

  exports.findById = function(req, res) {
    var id = req.params.id;
    var table = req.params.table;
    r.table(table).get(id).
      run(connection, function(err, result) {
          if (err) {res.send(null);}else
         {res.send(JSON.stringify(result, null, 2));}
      });
  };
  
  exports.create = function(req, res) {
    var presentation = req.body;
    var table = req.params.table;
    console.log(JSON.stringify(req.body));
    console.log('into: ' + table);
    r.table(table).insert(presentation).
	run(connection, function(err, result) {
	  if (err) {console.log("ERROR: insert aborted");res.send(JSON.stringify({status: 'error: could not insert'}));} else
	  {res.send(JSON.stringify({status: 'ok'}));}
	});
  };
  
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
  
  exports.update = function(req, res) {
    var table = req.params.table
    var presentation = req.body,
        id = req.params.id;
    r.table(table).get(id).update(presentation).
      run(connection, function(err, result) {
        if (err) {res.send(JSON.stringify({status: 'error: could not update'}))} else
        {res.send(JSON.stringify({status: 'ok'}));}
      });    
  };
  
  exports.createTable = function(req, res) {
	var table = req.params.table
	r.tableCreate(table).run(connection, function(err,result){
		if (err){res.send(JSON.stringify({status: 'error: could not create table'}))} else
		{console.log('table create: '+table),res.send(JSON.stringify({status: 'ok'}));}
	});
  };
  
  exports.delete = function(req, res) {
    var table = req.params.table
    var id = req.params.id;
    r.table(table).get(id).delete().
      run(connection, function(err, result) {
          if (err) {res.send(JSON.stringify({status: 'error: could not delete'}))} else
          {res.send(JSON.stringify({status: 'ok'}));}
      });
  };
})();
