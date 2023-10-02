const express = require('express');
const app = express();
const fs = require('fs');
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }));

app.get('/login', (req, res, next) => {
    res.send('<form id="loginForm" action="/login" method="POST"><label for="username">USERNAME</label><br><input type="text" id="username" name="username"><br><br><button type="submit">login</button></form>');
});

app.post('/login', (req, res, next) => {
    const username = req.body.username;
    res.redirect(`/?username=${username}`);
});

app.get('/', (req, res, next) => {
    const username = req.query.username || 'Unknown';

    fs.readFile('message.txt', 'utf-8', (err, data) => {
        if (err) {
            console.log(err);
        } else {
            res.send(`<form method="POST" action="/?username=${username}"><p>Send Message</p><p>${data}</p><input type="text" id="message" name="message"><br><button type="submit">Send</button></form>`);
        }
    });
});

app.post('/', (req, res, next) => {
    const username = req.query.username || 'Unknown';
    const message = req.body.message;

    // Append the message to the file
    fs.appendFile('message.txt', `${username} : ${message}\n`, (err) => {
        if (err) {
            console.log(err);
            return res.status(500).send('Internal Server Error');
        }

        fs.readFile('message.txt', 'utf-8', (err, data) => {
            if (err) {
                console.log(err);
                return res.status(500).send('Internal Server Error');
            }

            // Redirect to the main page with the username as a query parameter
            res.redirect(`/?username=${username}`);
        });
    });
});

app.listen(3000);