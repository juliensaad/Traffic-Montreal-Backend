

var minutes = 5, the_interval = minutes * 60 * 1000;
var conditions = ["Fast","Slow","Congestion","Heavy congestion","CLOSED"];

var http = require('http');

var secretKey = "Ag-3DI6qUbzGEVT_sDh73C2dxW36AApaSCpk0rlhCA0AFLb-4nKzvDOHq2b40OLg";
var baseUrl = "dev.virtualearth.net";

var mongoose = require('mongoose');
var Bridge     = require('./app/models/bridge');

//setInterval(function() {
	
	// Fetch delays from BING servers
	Bridge.find(function(err, bridges) {
		for(var i = 0; i < bridges.length ; i++){
	   		fetchCoordsFromBridge(bridges[i]);
	   	}
	});

//}, the_interval);

function fetchCoordsFromBridge(bridge){
	var params = '?o=json&wp.0='+bridge.start+"&wp.1="+bridge.end+"&key="+secretKey;
	var urlPath = '/REST/V1/Routes/Driving' + params;

	var options = {
	  host: baseUrl,
	  port: 80,
	  path: urlPath
	};

	// Fetch realtime traffic info
	http.get(options, function(res) {
	  var data = '';
	  res.on('data', function(chunk) {
	    data += chunk;
	  });
	  res.on('end', function() {
	    var obj = JSON.parse(data);

	    // Save traffic info
	    var realTime = obj.resourceSets[0].resources[0].travelDurationTraffic;
	    var time = obj.resourceSets[0].resources[0].travelDuration;


	    var ratio =  1.0-(time/realTime);
		var percentage = 100-(ratio*100);
		
		if(percentage>100){
			percentage = 100;
		}

		if(ratio<0){
			ratio = 0;
		}

		bridge.time = time;
		bridge.realTime = realTime;
		bridge.percentage = percentage;
		bridge.delay = ratio*100*11;
		bridge.lastUpdate = Date.now()
		
		var color = "0xff0000";
		var condition = 4;
		if(ratio<=0.25){						// Green 
			color = "0x1cad00";
			condition = 0;
	    }else if(ratio>0.25 && ratio<=0.35){ // Yellow
	      	color = "0xfc9a00";
	      	condition = 1;
	    }else if(ratio>0.35 && ratio<=0.50){	// Red
	      	color = "0xf90100";
	      	condition = 2;
	    }else{									// Magenta
	      	color = "0xb60000";
	      	condition = 3;
	    }

	    bridge.color = color;
	    bridge.cond = conditions[condition];


	    bridge.save(function(err) {
	      if (err) console.log("Error saving");
	      console.log("Success saving");
	    });

	    // Update colors and data shown
	  });
	}).on('error', function(e) {
	  console.log("Got error: " + e.message);
	}); 
}