var http = require("http");
var URL = require("url").URL;
var records = require("./db.json");

const PORT = process.env.PORT || 8084;
const WAIT = 5000;

function getList(req, res) {
	var list = records.slice().map(rec => JSON.stringify(rec) + "\n");
	var len = list.reduce((size, cur) => { size += Buffer.byteLength(cur); return size; }, 0);

	function next() {
		var cur = list.shift();
		if(!cur) {
			res.end();
			return;
		}

		res.write(cur);
		setTimeout(next, WAIT);
	}

	res.writeHead(200, {
		"Content-Type": "application/x-ndjson",
		"Content-Length": len.toString(),
		"X-Accel-Buffering": "no"
	});
	setTimeout(next, WAIT);
}

function get(req, res) {
	res.writeHead(200, {
		"Content-Type": "application/json"
	});
	res.end(JSON.stringify({}));
}

function cart(req, res){
	res.writeHead(200, {
		"Content-Type": "application/json"
	});

	var data = {
		count: 15
	}

	setTimeout(function(){
		res.end(JSON.stringify(data));
	}, 500);
}

function handler(req, res){
	var url = new URL(req.url, "http://localhost:8084");
	switch(url.pathname) {
		/*case "/":
			return void res.end('Not found');*/
		case "/product":
			return getList(req, res);
		case "/cart":
			return cart(req, res);
		default:
			return get(req, res);
	}
}

http.createServer(handler).listen(PORT);
