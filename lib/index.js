var http = require("http");
var URL = require("url").URL;
var records = require("./db.json");

const PORT = process.env.PORT || 8084;
const WAIT = 500;

function getList(req, res, url) {
	var json = url.searchParams.has('json');
	var list = records.slice().map(rec => JSON.stringify(rec) + "\n");
	var len = list.reduce((size, cur) => { size += Buffer.byteLength(cur); return size; }, 0);
	var txt = json && JSON.stringify(records);

	function next() {
		var cur = list.shift();
		if(!cur) {
			res.end(json ?
				txt :
				void 0
			);
			return;
		}

		if(!json) {
			res.write(cur);
		}

		
		setTimeout(next, WAIT);
	}

	if(json) {
		res.writeHead(200, {
			"Access-Control-Allow-Origin": "*",
			"Content-Type": "application/json",
			"Content-Length": Buffer.byteLength(txt)
		});
	} else {
		res.writeHead(200, {
			"Access-Control-Allow-Origin": "*",
			"Content-Type": "application/x-ndjson",
			"Content-Length": len.toString(),
			"X-Accel-Buffering": "no"
		});
	}

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
	}, WAIT);
}

function handler(req, res){
	var url = new URL(req.url, "http://localhost:8084");
	switch(url.pathname) {
		case "/product":
			return getList(req, res, url);
		case "/cart":
			return cart(req, res, url);
		default:
			return get(req, res, url);
	}
}

http.createServer(handler).listen(PORT);
console.error(`Serving at: http://localhost:${PORT}`);