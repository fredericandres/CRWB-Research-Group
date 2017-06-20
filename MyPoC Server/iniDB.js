r = require('rethinkdb');
r.connect().then(function(connection){r.tableCreate('observation').run(connection, function(err, cursor) {})});
process.exit();