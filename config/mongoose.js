const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/auth-test',{useNewUrlParser:true});

const db = mongoose.connection;

db.on('err',console.error.bind(console,'Error Connecting to Database'));

db.once('open',function(){
    console.log('Database successfully Connected ::MongoDB');

});
module.exports = db;