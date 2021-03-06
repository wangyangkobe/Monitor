var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var show = require('./routes/show');

var os_utils = require('os-utils');
var mongoose = require('mongoose');

var Monitor = require('./models/MonitorModel.js');

mongoose.connect("mongodb://localhost/monitor");
var db = mongoose.connection;
db.on('error', function (error) {
    console.error("db error: " + error);
});
db.on('open', function () {
    console.log("db is open!");
})
var app = express();
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

// starting http  servers
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
io.set("log level", 0);

server.listen(8000, function () {
    console.log('Express server listening on port ' + app.get('port'));
});

io.on('connection', function (socket) {
    console.log('connection');
    var send = function () {
        os_utils.cpuUsage(function (useage) {
            var monitor = {
                'time': (new Date()).getTime(),
                'cpu': Math.round(useage * 1000) / 10,
                'mem': Math.round((1 - os_utils.freememPercentage()) * 1000) / 10
            };
            socket.emit("system", monitor);
            Monitor.create(monitor, function (error, res) {
                if (error) return console.log(error);
                console.log(res);
            })
        });
    };

    setInterval(send, 1000);
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, "views/monitor.html"));
});
app.all('/show', show);
app.use('/', routes);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

module.exports = app;
