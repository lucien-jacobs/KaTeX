var path = require("path");

var browserify = require("browserify");
var express = require("express");

var app = express();

app.use(express.logger());

app.get("/katex.js", function(req, res, next) {
    var b = browserify();
    b.add("./katex");

    var stream = b.bundle({standalone: "katex"});

    var body = "";
    stream.on("data", function(s) { body += s; });
    stream.on("error", function(e) { next(e); });
    stream.on("end", function() {
        res.setHeader("Content-Type", "text/javascript");
        res.send(body);
    });
});

app.get("/test/katex-tests.js", function(req, res, next) {
    var b = browserify();
    b.add("./test/katex-tests");

    var stream = b.bundle({});

    var body = "";
    stream.on("data", function(s) { body += s; });
    stream.on("error", function(e) { next(e); });
    stream.on("end", function() {
        res.setHeader("Content-Type", "text/javascript");
        res.send(body);
    });
});

app.use(express.static(path.join(__dirname, "static")));
app.use(express.static(path.join(__dirname, "build")));
app.use("/test", express.static(path.join(__dirname, "test")));

app.use(function(err, req, res, next) {
    console.error(err.stack);
    res.setHeader("Content-Type", "text/plain");
    res.send(500, err.stack);
});

app.listen(7936);
console.log("Serving on http://0.0.0.0:7936/ ...");
