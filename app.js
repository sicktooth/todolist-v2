const express = require('express');
const app = express();
const port = 8000;
const date = require(__dirname + '/date.js');

app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname));

const items = ["Buy Food", "Cook Food", "Eat Food"],
      workItems = [];

app.set('view engine', 'ejs');
app.get('/', (req, res) => {
    
    const dayOfWeek = date.getDate();
    res.render("list", {
        listTitle: dayOfWeek,
        newListItems: items
    });
    
});

app.get("/work", function(req, res) {
    res.render("list", {
        listTitle: "Work List",
        newListItems: workItems
    })
});

app.post("/", (req, res) =>{
    const item = req.body.newItem;
    if (req.body.list === "Work") {
        workItems.push(item);
        res.redirect("/work")
    } else {
        items.push(item);
        res.redirect("/");
    }
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