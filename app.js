const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose  =require('mongoose') ; 

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");          // for using template we have to do this 

mongoose.connect("mongodb://localhost:27017/todolistDB" , {useNewUrlparser  :true}) ; 
const itemSchema = {
    name:String
} ;

const Item = mongoose.model('Item' , itemSchema) ; 
 
let items = [];
let workItems = [];

app.get("/", function (request, response) {

    Item.find({},function(err,founditems){

        if(founditems.length ===  0)
        {
            Item.insertMany(items , function(err){
                if(err)
                console.log(err) ;
            
                else
                console.log("Suceesfully inserted ")  ;
            }) ; 
        }
        response.render("list", { listTitle: 'Today', newListItems: founditems });        // passing the variable to our template to update
    }) ;
});

app.get("/work", function (request, response) {
    response.render("list", { listTitle: "WorkList", newListItems: workItems });
})

app.post("/", function (request, response) {
    let itemName = request.body.task;

    const item = new Item({
        name: itemName 
    });
    item.save() ; 
    response.redirect("/") ; 

    // response.render("list" , {newListItem : item}) ;  // this gives error describes below arises due  to above render
});

app.post("/delete" , function(request , response){
    const checkedItemId  =  request.body.checkbox  ; 

    Item.findByIdAndRemove(checkedItemId ,function(err){
        if(!err){
            console.log("Successfully deleted checked item .")
            response.redirect("/") ; 
        }
    })
}) ; 

app.listen(process.env.PORT ||3000 , function (request, response) {
    console.log("Server started at port 3000");
});


// response.render("list" , {kindOfday: day}) ;
// when we render to list.ejs we only pass kindofday variable , what about the newlistitem 
// that's why we are receiveing the error 
//to resolve it we have to pass both the variables at a time and redirect in post method 