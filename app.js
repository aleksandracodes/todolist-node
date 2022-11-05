const express = require('express');
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const _ = require('lodash')

const app = express();

require("dotenv").config();

const srvr = process.env.APP_KEY; 
const srvrCred = process.env.APP_SECRET; 

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true })); // required in app.post method
app.use(express.static('public'))


mongoose.connect("mongodb+srv://" + srvr + ":" + srvrCred + "@cluster0.mqlswwm.mongodb.net/todolistDB",{
    useNewUrlParser: true, 
    useUnifiedTopology: true,
    family: 4,
})

// Create New Schema
const itemsSchema = {
    name: String
}

// Create New Model Schema
const Item = mongoose.model('Item', itemsSchema);

// Add a New Model Schema
const item1 = new Item({
    name: 'Welcome to your todolist!'
})

const item2 = new Item({
    name: 'Hit + button to add a new item'
})

const item3 = new Item({
    name: '<-- Hit this to delete an item'
})

// Add a New Schemas To Array
const defaultItems = [item1, item2, item3];


// Create a new schema for todo lists
const listSchema = {
    name: String,
    items : [itemsSchema]
};

// Create mongoose model
const List = mongoose.model("List", listSchema);


// Request when the page is loaded
app.get('/', (req, res) => {

    Item.find({}, function(err, foundItems){
        if (foundItems.length === 0) {
            // Insert a New Schema if there are no items on the list (prevent adding default items repeatedly)
            Item.insertMany(defaultItems, function(err) {
                if (err) {
                    console.log(err)
                } else {
                    console.log('Successfully saved default items to DB')
                }
            })
            res.redirect('/')
        } else {
            res.render('list', { listTitle: 'Today', newListItems: foundItems });
        }
    })
});

// CREATE CUSTOM TO-DO LIST USING ROUTE PARAMETER
app.get("/:customListName", function(req, res) {
    const customListName = _.capitalize(req.params.customListName);
   
    List.findOne({name: customListName}, function(err, foundList) {
      if(!err){
        if(!foundList){
          // Create New List
          const list = new List({
            name: customListName,
            items: defaultItems
          });
   
          list.save(() => res.redirect('/' + customListName));

        } else {
          // Show Existing List
          res.render("list", {
              listTitle: foundList.name,
              newListItems: foundList.items
            });
        }
      }
    });
  });


app.post('/', (req, res) => {
    const itemName = req.body.newItem;
    const listName = req.body.list;  // corresponds to the name of the submit button
    
    // create a new item document based on MongdoDB model
    const item = new Item({
        name: itemName
    });

    if (listName === 'Today') {
        item.save();
        res.redirect('/');
    } else {
        List.findOne({name: listName}, function(err, foundList){
            foundList.items.push(item)  // embedded array of item (ListSchema)
            foundList.save();
            res.redirect('/' + listName);
        })
    }
});

app.post('/delete', (req, res) => {
    const checkedItemId = req.body.checkbox;

    const listName = req.body.listName;

    if(listName === 'Today') {
        // <ModelName>.findByIdAndRemove(<id>, function(err){...})
        Item.findByIdAndRemove(checkedItemId, function(err){
            if (!err) {
                console.log('Successfully deleted the item');
                res.redirect('/');
            }
        })
    } else {
        List.findOneAndUpdate({name: listName}, {$pull: {items: {_id: checkedItemId}}}, function(err, foundList) {
            if (!err) {
                res.redirect('/' + listName);
            };
        });
    };
});


app.listen(process.env.PORT || 3000, function () { 
    console.log("Server has started successfully.");
}); 