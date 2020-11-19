const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();
const pizzauser = require('./model');
const Order = require('./order');

app.use(cors());
app.use(express.urlencoded({extended: true}));
app.use(express.json());
const PORT = process.env.PORT || 5000;
const http = require('http');
const server = http.createServer(app);
const io = require('socket.io')(server);
mongoose.connect('mongodb+srv://mydb01:Mydb01@firstdb.yskyo.mongodb.net/firstdb?retryWrites=true&w=majority',{
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
    useNewUrlParser: true
});
mongoose.connection.on('connected',()=>{
console.log('system connceted to cloud database');
});
console.log('io start')
io.on('connection',socket => {
   socket.on('neworder',evt => {
    socket.broadcast.emit('updateorder',"update");
   });
   socket.on('com',data => {
socket.broadcast.emit(`com-${data.cid}`,data.orderid);
   });
   socket.on('changestatus',data => {
       const tm = new Date().toLocaleTimeString();
socket.broadcast.emit(data.statusid,{value: data.value,time: tm});
   });
   
   })
// io.on('connection',socket => {
//     console.log('user avyo')
// socket.on('order',data => {
// console.log('event get')
// });
// });
app.post('/register',(req,res) => {
const newUser = new pizzauser({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password
});

newUser.save().then(() => res.send({result: '1'})).catch(() => res.send({result: '0'}))

});

app.post('/login',(req,res) => {
    const newUser = mongoose.model('Pizzauser');
    newUser.findOne({email: req.body.email,password: req.body.password},(err,data) => {
        if(err || data === null) {

            res.send({user: '0'})
        }
        else{
        res.send({user: data._id})
        }
    })
    });
app.post('/order',(req,res) => {
const { phone , address , items , customerId} = req.body;
const newOrder = new Order({
    phone,
    address,
    items,
    customerId
});
newOrder.save((err,data) => {
    if(err) {console.log(err)}
    else{
        res.send({pizzadata: data})
    }
});
});
app.post('/order/status/:id',(req,res) => {
   
    const fetchOrder = mongoose.model('Order');
    fetchOrder.findOneAndUpdate({_id: req.params.id},{status: req.body.id},(err,data) => {
        if(err) {
            console.log(err)
        }
    }).then(thendata => {
        res.send({result: thendata})
    })
    
    });
app.get('/order/:id',(req,res) => {
const fetchOrder = mongoose.model('Order');

fetchOrder.find({customerId: req.params.id,status: {$ne: 'completed'}},null,{sort: {createdAt: '-1'}}).then(resdata => {
    
    res.send({orders: resdata})
}).catch((err) => {
    console.log(err);
})

});
app.get('/pizza/status/:id',(req,res) => {
    const fetchOrder = mongoose.model('Order');
    
    fetchOrder.findOne({_id: req.params.id},(err,data) => {
        if(err){
            console.log(err);
        }
        else if(data !== null) {
            const tim = new Date(data.createdAt).toLocaleTimeString();
          res.json({sta: data.status,time: tim})
        }
    });
    
});
app.get('/admin',(req,res) => {
const admindata = mongoose.model('Order');
admindata.find({status: {$ne : 'completed'}},null,{sort: {createdAt: '-1'}}).populate('customerId','-password').exec((err,data) => {
if(err || data === null) {
    console.log(data)
}
else{
    res.send({orders: data})
}
});
});
app.get('/register',(req,res) => {
    res.json({info: 'all set'})
})

server.listen(PORT,() => {
    console.log('server is live')
})