const express = require('express');
const app = express();
const mongoose = require('mongoose');
const {Schema} = mongoose;
const port = 8000;

app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname));

mongoose.connect('mongodb://localhost:27017/todolistDB');

const itemsSchema = new Schema ({
    name: String
});

const Item = mongoose.model('Item', itemsSchema);
const item1 = {name: "Eat"};
const item2 = {name: "Code & Work"};
const item3 = {name: "Add yours below"};
const defaultItems = [item1, item2, item3]


app.set('view engine', 'ejs');
app.get('/', (req, res) => {
async function findResults() {
    
    try {
        let results = await Item.find({});

        if (results.length === 0) {
            Item.insertMany(defaultItems)
            res.redirect('/')
        } else {
                res.render("list", {
                listTitle: "Today",
                newListItems: results
            });
        }
    } catch (error) {
            console.log(error);
        }
    }
    findResults();
    
});

app.post("/delete", function(req, res){
    const checkedItemId = req.body.checkBox;
    // console.log(checkedItemId);
    
    async function deleteTask() {
        try {
           await Item.findByIdAndDelete(checkedItemId);
           console.log("successfully deleted the Item");
           res.redirect('/');
        } catch (error) {
            console.log(error);
        }
    }
    deleteTask();
    
})

app.get("/work", function(req, res) {
    res.render("list", {
        listTitle: "Work List",
        newListItems: workItems
    })
});

app.post("/", (req, res) =>{
    const itemName = req.body.newItem;
    Item.create({name: itemName});
    res.redirect("/")
})

app.post("/work", (req, res) => {
    const item = req.body.newItem;
    workItems.push(item);
    res.redirect("/work");
});

app.get("/about", (req, res) => {
    res.render("about");
});

app.listen(port, function() {
    console.log("listening on port " + port);
});