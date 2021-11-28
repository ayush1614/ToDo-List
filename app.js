const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public")) ;
app.set("view engine", "ejs");          // for using template hmhe yh karna hota hai

var items = [];

app.get("/", function (request, response) {

    var today = new Date();
    var options = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day:"numeric"
    }

    var day = today.toLocaleDateString("en-US", options);   // name should be same of both variables 
    response.render("list", { kindOfday: day, newListItems: items });        // passing the variable to our template to update
});

app.post("/", function (request, response) {

    items.push(request.body.task);
    response.redirect("/");

    // response.render("list" , {newListItem : item}) ;  // this gives error describes below arises due  to above render
});

app.listen(3000, function (request, response) {
    console.log("Server started at port 3000");
});



// response.render("list" , {kindOfday: day}) ;
// when we render to list.ejs we only pass kindofday variable , what about the newlistitem 
// that's why we are receiveing the error 
//to resolve it we have to pass both the variables at a time and redirect in post method 