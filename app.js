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
const item1 = {name: "Welcome to your Todo list"};
const item2 = {name: "⬅ hit the check to delete"};
const item3 = {name: "Add yours below ⬇"};
const defaultItems = [item1, item2, item3]

const listSchema = new Schema ({
    name: String,
    items: [itemsSchema]
});
const List = mongoose.model('List', listSchema);

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

app.get("/:customListName", (req, res)=>{
    const customListItems = req.params.customListName;
    
    const findResults = async () => {
        try {
            let results = await List.findOne({name:customListItems});
            
            if (results) {
                res.render('list', {
                    listTitle: `${results.name} Todo List`,
                    newListItems: results.items
                });
            } else {
                List.create({
                    name: customListItems,
                    items: defaultItems
                })
                res.redirect(`/${customListItems}`);
            }
        } catch (error) {
            console.log(error);
        }
    }
    findResults();
})

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