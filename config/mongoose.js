const mongoose = require('mongoose');
// mongodb+srv://shakirck:<hJhZyViGQw2Te70I>@cluster0-ytjus.mongodb.net/<dbname>?retryWrites=true&w=majority
mongoose.connect('mongodb://localhost/auth-test',{useNewUrlParser:true});

const db = mongoose.connection;

db.on('err',console.error.bind(console,'Error Connecting to Database'));

db.once('open',function(){
    console.log('Database successfully Connected ::MongoDB');

});
module.exports = db;