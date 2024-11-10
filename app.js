require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const {Schema} = mongoose;
const port = process.env.PORT || 8000;
const _ = require('lodash')

app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname));

mongoose.connect("mongodb+srv://sicktooth003:"+process.env.remoteDB_connect_password+"@cluster0.diwwq.mongodb.net/todolistDB");

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
    const capitalizeCustomListName = _.capitalize(req.params.customListName);
    const customListName = _.kebabCase(capitalizeCustomListName);
    
    const findResults = async () => {
        try {
            let results = await List.findOne({name:customListName});
            
            if (results) {
                res.render('list', {
                    listTitle: `${results.name}`,
                    newListItems: results.items
                });
            } else {
                List.create({
                    name: customListName,
                    items: defaultItems
                })
                res.redirect(`/${customListName}`);
            }
        } catch (error) {
            console.log(error);
        }
    }
    findResults();
})

app.post("/delete", function(req, res){
    const checkedItemId = req.body.checkBox;
    const listName = req.body.listName;
    console.log(checkedItemId);
    
    async function deleteTask() {
        try {
            if (listName === "Today"){
                await Item.findByIdAndDelete(checkedItemId);
                console.log("successfully deleted the Item");
                res.redirect('/');
            } else {
                await List.findOneAndUpdate({name: listName}, {$pull: {items: {_id: checkedItemId}}})
                console.log("successfully deleted the Item");
                res.redirect('/'+listName);
            }
           
        } catch (error) {
            console.log(error);
        }
    }
    deleteTask();
    
})

app.post("/", (req, res) =>{
    const itemName = req.body.newItem;
    const listName = req.body.list;
    
    if (listName === "Today") {
        
        Item.create({name: itemName})
        res.redirect("/")
    } else {
        const find = async () => {
            try {
                await List.findOneAndUpdate({name:listName}, {$push: {items: {name: itemName}}})
                res.redirect(`/${listName}`);
            } catch (error) {
                console.log(error, error.message);
            }
        }
        find()
    }
})

app.get("/about", (req, res) => {
    res.render("about");
});

app.listen(port, function() {
    console.log("listening on port " + port);
});