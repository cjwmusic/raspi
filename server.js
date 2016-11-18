var http = require("http")
var url = require("url")
var fs = require("fs")
var path = require("path")

var rpio = require('rpio')

var gpio_pin = 21;

rpio.init({mapping : 'gpio'});
rpio.open(gpio_pin, rpio.OUTPUT, rpio.LOW);

function answerToClient(response, path) {
	response.writeHead(200, {"Content-Type" : "text/json"});
	
	var res;
	var isReadData = false;

	if(path == '/ledon') {
		rpio.write(gpio_pin, rpio.HIGH);
		res = successJsonData('LED has been opened~');
	} 

	else if (path == '/ledoff') {
		rpio.write(gpio_pin, rpio.LOW);
		res = successJsonData('LED has been shutdown~');
	} 
	
	else {
		isReadData = true;
		readJsonData(path + '.json', function(result){
			response.write(result);
			response.end();		
		});
	}
	
	if (!isReadData) {
		response.write(JSON.stringify(res));
		response.end();
	}

}

function readJsonData(filePath, callBack) {
	
	console.log('Ready to load data ' + filePath);
	fs.readFile(path.join(__dirname, filePath), {encoding : 'utf-8'}, function(err, bytesRead) {
		if(err) {
			data = errJsonData();
		} else {
			var data = JSON.parse(bytesRead);
		}
		console.log('read ' + filePath + 'success!');
		var result = JSON.stringify(data);
		callBack(result);	
	})
}

function errJsonData() {
	var result = {
		data : {
			success : false,
			msg : 'This Interface is on building...'
		}
	};
	return result;	
}

function successJsonData(message) {
	var result = {
		data : {
			success : true,
			msg : message
		}
	}
	return result;
}

function start(router, handle) {
	function onRequest(request,response) 
	{	
		//According the path to match the json file
		pathName = url.parse(request.url).pathname; 	
		answerToClient(response, pathName);
		console.log("Request for " + pathName);
	}
	http.createServer(onRequest).listen(9009);
	console.log("Server has Started");
}



start();
