const express = require('express');
const mongoose = require('mongoose');

const todoHandler = require('./routeHandler/todoHandler');
const app = express();

app.use(express.json());

// database connection with mongoose

const connnetDb = async() =>{
    try{
        await mongoose.connect('mongodb://127.0.0.1:27017/test');
        console.log("Connection Successfully");
    } 
    catch(err){
       console.log(err)
    } 
     } 
//application routes

app.use('/todo', todoHandler);

function errorHandling(err, req, res, next){
    if(res.headersSent){
        return next(err);
    }

    res.status(500).json({error: err})
}

app.listen(3000, async()=>{

    console.log("Server run at port 3000");
    await connnetDb();

});

app.get('/', (req,res)=>{

    res.send("Welcome to Homepage for Express js");

})