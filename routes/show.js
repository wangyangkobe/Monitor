var express = require('express');
var router = express.Router();
var path = require('path');
var Monitor = require('../models/MonitorModel');
var util = require('util');

/* GET users listing. */
router.get('/show', function (req, res) {
    //res.sendFile(path.normalize(__dirname + "/../views/show.html"));
    res.render('show.html', {'result': []});
});

router.post('/show', function (req, res) {
    var start = coverToDate(req.body.start);
    var end = coverToDate(req.body.end);

    Monitor.find({time: {$gte: start, $lt: end}},
        {time: 1, cpu: 1, _id: 0},
        function (error, result) {
            if (error) return res.end(util.inspect(error));
            res.json(result);
        });
})

function coverToDate(time) {
    var hour = time.split(":")[0];
    var minute = time.split(":")[1];

    var date = new Date();
    date.setHours(hour, minute);
    return date;
}
module.exports = router;
