//jshint esversion:6

const express = require('express');
const bodyParser = require('body-parser')

const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));  // required in app.post method

app.get('/', (req, res) => {

    let today = new Date();

    let options = {
        weekday: 'long',
        day: 'numeric',
        month: 'long'
    };

    let day = today.toLocaleDateString('en-US', options);
     
    res.render('list', {kindOfDay: day})
});

app.post('/', (req, res) => {
    let item = req.body.newItem
    console.log(item)
});

app.listen(3000, () => {
  console.log('Server started on port 3000');
});
