//jshint esversion:6

const express = require('express');
const bodyParser = require('body-parser')

const app = express();

app.set('view engine', 'ejs');

app.get('/', (req, res) => {

    let today = new Date();
    let currentDay = today.getDay()

    if (currentDay === 6 || currentDay === 0) {
        res.send("<h1>Yay! It's weekend!</h1>")
    } else {
        res.sendFile(__dirname + '/index.html')
    }
});

app.listen(3000, () => {
  console.log('Server started on port 3000');
});
