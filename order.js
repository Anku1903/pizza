const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const orderschema = new Schema({
    phone: {type: String, required: true},
    address: {type:String , required: true },
    items: {type:Array , required: true },
    customerId: {type: mongoose.Schema.Types.ObjectId,
        ref: "Pizzauser",
        required: true
    
    },
    status: { type:String , default: "Placed"},
    ctime: {type: String , default: '00:00 AM'},
    pretime: {type: String , default: '00:00 AM'},
    detime: {type: String , default: '00:00 AM'},
    comtime: {type: String , default: '00:00 AM'},

},{timestamps: true});
const Order = mongoose.model('Order',orderschema);
module.exports = Order;
