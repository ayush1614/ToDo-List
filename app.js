const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
const lodash = require('lodash') ;

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");          // for using template we have to do this 

mongoose.connect("mongodb+srv://<username>:<PassWord>@cluster0.ztydm.mongodb.net/todolistDB", { useNewUrlparser: true });
const itemSchema = {
    name: String
};

const listSchema = {
    name: String,
    items: [itemSchema]
};


const Item = mongoose.model('Item', itemSchema);      //creating item model
const List = mongoose.model('List', listSchema);       // creating list model

let items = [];
let workItems = [];

app.get("/", function (request, response) {

    Item.find({}, function (err, founditems) {

        if (founditems.length === 0) {
            Item.insertMany(items, function (err) {
                if (err)
                    console.log(err);

                else
                    console.log("Suceesfully inserted ");
            });
        }
        response.render("list", { listTitle: 'Today', newListItems: founditems });        // passing the variable to our template to update
    });
});

app.get("/:customListName", function (req, res) {
    const customListName = lodash.capitalize(req.params.customListName);

    List.findOne({ name: customListName }, function (err, foundLists) {
        if (!err) {
            if (!foundLists) {
                // creates lists 
                const list = new List({
                    name: customListName,
                    items: items
                });
                list.save();
                res.redirect("/" + customListName);
            }
            else
                res.render("list", { listTitle: foundLists.name, newListItems: foundLists.items });
        }
    })
});

app.get("/work", function (request, response) {
    response.render("list", { listTitle: "WorkList", newListItems: workItems });
})

app.post("/", function (request, response) {
    let itemName = request.body.task;
    const listName = request.body.list;

    const item = new Item({
        name: itemName
    });

    if (listName === 'Today') {
        item.save();
        response.redirect("/");
    }
    else {
        List.findOne({ name: listName }, function (err, foundLists) {
            foundLists.items.push(item);
            foundLists.save();
            response.redirect("/" + listName);
        })
    }
    // response.render("list" , {newListItem : item}) ;  // this gives error describes below arises due  to above render
});


//delete the item in the lists
app.post("/delete", function (request, response) {
    const checkedItemId = request.body.checkbox;
    const listName = request.body.listName;
    if (listName === 'Today') {
        Item.findByIdAndRemove(checkedItemId, function (err) {            // callback is required fro removing here 
            if (!err) {
                console.log("Successfully deleted checked item .")
                response.redirect("/");
            }
        });
    }
    else {
        List.findOneAndUpdate({ name: listName }, { $pull: { items: { _id: checkedItemId } } }, function(err,foundLists){
            if(!err){
                response.redirect ( "/"+listName) ; 
            }
        })
    }
});

app.listen(process.env.PORT || 3000, function (request, response) {
    console.log("Server started at port 3000");
});


// response.render("list" , {kindOfday: day}) ;
// when we render to list.ejs we only pass kindofday variable , what about the newlistitem 
// that's why we are receiveing the error 
//to resolve it we have to pass both the variables at a time and redirect in post method 