const express = require('express');
const mongoose = require('mongoose');

const todoHandler = require('./routeHandler/todoHandler');
const app = express();

app.use(express.json());

// database connection with mongoose

mongoose.connect('mongodb://127.0.0.1:27017/test')
.then(()=> console.log("Connection Successful"))
.catch((err) => console.log(err));

function errorHandling(err, req, res, next){
    if(res.headersSent){
        return next(err);
    }

    res.status(500).json({error: err})
}

app.listen(3000, ()=>{

    console.log("Server run at port 3000");

});

app.get('/', (req,res)=>{

    res.send("Welcome to Homepage");

})
