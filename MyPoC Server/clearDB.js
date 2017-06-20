r = require('rethinkdb');
r.connect().then(function(connection){r.table('observation').delete().run(connection, function(err, cursor) {})});
process.exit();