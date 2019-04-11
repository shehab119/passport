var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
//user Schema

var UserSchema = mongoose.Schema({

name: {
	type:String,
	index:true
},
password: {
	type:String,
}
});

var User = module.exports = mongoose.model('user',UserSchema);

module.exports.createUser = function(newUser, callback){

var bcrypt = require('bcryptjs');
bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(newUser.password, salt, function(err, hash) {
       console.log(newUser);
       console.log(newUser);
        newUser.password = hash;
        newUser.save(callback);
        console.log(newUser.password);
    });
});
}


module.exports.getUserByName = function(name,callback){
	var query = {name:name};
	User.findOne(query, callback);
}


module.exports.getUserByUserId = function(id,callback){
	User.findById(id, callback);
}

module.exports.comparePassword = function(candidatePassword, hash, callback){
	bcrypt.compare(candidatePassword, hash, function(err, isMatch){
		if(err) throw err;
		callback(null, isMatch);
	});
}