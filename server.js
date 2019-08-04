const express = require('express'),
      path = require('path'),
      bodyParser = require('body-parser'),
      cors = require('cors'),
      routes = require('./Routes/Routes'),
      mongoose = require('mongoose');
  
var Todo = require('./Models/Todo');


mongoose.connect("mongodb://localhost:27017/vuenodedb").then(
     () => { console.log("Database connection is successful") },
     err => { console.log("Error when connecting to the database"+ err) }
);     

const app = express();

app.use(express.static('public'));
app.use(bodyParser.json())
app.use(cors());

var port = process.env.PORT || 4000;

app.listen(()=> { console.log('Listening on port '+ port); });


app.post('/create',(req,res) => {
    var todo = new Todo(req.body);
    todo.save().then(todo=> {
        res.status(200).json({ "message":"Todo successfully added" });
    }).catch(err => {
       res.status(400).send("Error when saving to database");
    });
});

app.get('/todos',(req,res)=> {
    Todo.find((err,todos) => {
        if(err){
            console.log(err);
        }else{
            res.json(todos);
        }
    })
});

app.get('/todos/:id',(req,res) => {
    var id = req.params.id;
    Todo.findById(id, (err, todo) => {
       res.json(todo);
    });
})


app.put('/todos/:id',(req,res)=>{
    Todo.findById(req.params.id, (err, todo) => {
        if(!todo){
            return next(new Error("Error getting the todos"))
        }else{
           todo.name = req.body.name;
           todo.save().then(todo => {
               res.json('Todo updated sucessfully');
           })
           .catch(err => {
              res.status(400).send("Error when updating the todo");
           })
        }
    })
})

app.get('/todos/:id',(req,res) => {
    Todo.findByIdAndRemove({ _id: req.params.id }, (err,todo) => {
        if(err) res.json(err);
        else res.json('Todo sucessfully removed');
    });
});

