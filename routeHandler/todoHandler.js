const express = require('express');
const router = express.Router();
const todoSchema = require('../Schema/todoSchemas');
const mongoose = require('mongoose');

const Todo = new mongoose.model("Todo", todoSchema);

// Get all the todos 

router.get("/", async(req, res)=>{
    await Todo.findMany({title:"Learn MongoDatabase"}, (err, data)=>{
      
        if(err){
            res.status(500).json({
                error: "There was a server side error"
            });
        }else{
            res.status(200).json({
                result:data,
                message: "Todo Data Find Successfully"
            });
        }
    });

     

})

// Get a todo by id

router.get('/:id', async(req, res)=>{
 
  


})

//POST todo

router.post('/', async(req, res)=>{
 const newTodo = new Todo(req.body);

 await newTodo.save((err) => {
  
    if(err){
        res.status(500).json({
            error: "There was a server side error"
        });
    }else{
        res.status(200).json({
            message: "Todo was Inserted Successfully"
        });
    }

 }
 
 )

})

//POST Multiple todo

router.post('/all', async(req, res)=>{
 
    await Todo.insertMany(req.body, (err)=>{
        if(err){
            res.status(500).json({
                error: "There was a server side error"
            });
        }else{
            res.status(200).json({
                message: "Todo were Inserted Successfully"
            });
        }


    })

})

// Put a todo by id

router.put('/:id', async(req, res)=>{
 await Todo.updateOne({_id: req.params.id},{
    $set:{
        "title": "Learn MongoDatabase"
    }
 })


})

// delete todo
router.delete('/:id', async(req, res)=>{
    await Todo.deleteOne({_id: req.params.id},(err))
    if(err){
        res.status(500).json({
            error: "There was a server side error"
        });
    }else{
        res.status(200).json({
            message: "Todo Delete Successfully"
        });
    }



})

module.exports = router;