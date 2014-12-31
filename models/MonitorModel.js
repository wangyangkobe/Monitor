/**
 * Created by elqstux on 2014/12/26.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var monitorSchema = new Schema({
    time: {type: Date},
    cpu: String,
    mem: String
});

var Monitor = mongoose.model('Monitor', monitorSchema, "monitor");
module.exports = Monitor;