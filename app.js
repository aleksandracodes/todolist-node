//jshint esversion:6

const express = require('express');
const bodyParser = require('body-parser')

const app = express();

let items = ['Buy food', 'Cook food', 'Eat food'];

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));  // required in app.post method
app.use(express.static('public'))

// Request when the page is loaded
app.get('/', (req, res) => {

    let today = new Date();

    let options = {
        weekday: 'long',
        day: 'numeric',
        month: 'long'
    };

    let day = today.toLocaleDateString('en-US', options);
     
    res.render('list', {kindOfDay: day, newListItem: items})
});

app.post('/', (req, res) => {
    let item = req.body.newItem

    items.push(item);

    res.redirect('/');
});

app.listen(3000, () => {
  console.log('Server started on port 3000');
});
