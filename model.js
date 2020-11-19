const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const pizzaschema = new Schema({
    name: {type: String, required: true},
    email: {type:String , required: true , unique: true},
    password: {type:String , required: true }

});
const pizzauser = mongoose.model('Pizzauser',pizzaschema);
module.exports = pizzauser;
