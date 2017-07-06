var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var PerosnSchema   = new Schema({
	name: String,
	sex:String,
    age:Number,
    phone:String,
    address:String
});

module.exports = mongoose.model('Person', PerosnSchema);