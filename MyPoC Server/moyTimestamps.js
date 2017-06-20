//Watch everything that happens in the rethinkDB table "observation" that is related to given timestamps
r = require('rethinkdb');
step1 = '1';
if(process.argv[2]){step1 = process.argv[2];}
step2 = 'crwbdl';
if(process.argv[3]){step2 = process.argv[3];}
st1 = false;
st2 = false;

function inSteps(element){
  if(typeof element.step == 'undefined' || typeof element.value == 'undefined'){return false;}
  if(!st1 && element.step == step1 && element.value>0){st1 = true; return true;}
  else if(!st2 && element.step == step2 && element.value>0){st2 = true; return true;}
  else {return false;}
}

function arrayFilter(array){
  st1 = false;
  st2 = false;
  filtered = array.filter(inSteps);
  if (st1 && st2){return {value: Math.abs(filtered[1].value - filtered[0].value), points: 1};}
  else{return {value: 0, points: 0};}
}

r.connect().then(function(connection){r.table('observation').pluck('timestamp').run(connection, function(err, cursor){
  allValue = {value: 0, points: 0};
  cursor.each(function(err,row){if(Array.isArray(row.timestamp)){
	var tmp = arrayFilter(row.timestamp);
	allValue.value += tmp.value;
	allValue.points += tmp.points;}
  },function(){console.log("AllValues: value: " + allValue.value + " points: " + allValue.points);console.log("Average lag between " + step1 + " and " + step2 + " : " + (allValue.value/allValue.points));process.exit(0);});
})});
