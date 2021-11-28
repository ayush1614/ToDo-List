const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const date = require(__dirname + "/date.js");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");          // for using template we have to do this 

let items = [];
let workItems = [];
app.get("/", function (request, response) {

    let day = date.getDate();                                                 // name should be same of both variables 
    response.render("list", { listTitle: day, newListItems: items });        // passing the variable to our template to update
});

app.get("/work", function (request, response) {
    response.render("list", { listTitle: "WorkList", newListItems: workItems });
})

app.post("/", function (request, response) {
    let item = request.body.task;


    if (request.body.list === 'WorkList') {
        workItems.push(item);
        response.redirect("/work");
    }
    else {
        items.push(request.body.task);
        response.redirect("/");
    }


    // response.render("list" , {newListItem : item}) ;  // this gives error describes below arises due  to above render
});


app.listen(process.env.PORT ||3000 , function (request, response) {
    console.log("Server started at port 3000");
});



// response.render("list" , {kindOfday: day}) ;
// when we render to list.ejs we only pass kindofday variable , what about the newlistitem 
// that's why we are receiveing the error 
//to resolve it we have to pass both the variables at a time and redirect in post method 