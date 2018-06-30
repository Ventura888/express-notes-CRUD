const express = require('express');
const hbs = require('express-handlebars');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');
const app = express();

/////#########HBS SETUP#########/////
app.engine('hbs', hbs({
    extname: 'hbs',
    defaultLayout: 'layout',
    layoutsDir: __dirname + '/views/layouts',
    partialsDir: __dirname + '/views/partials'
}));
app.set('view engine', 'hbs')


//setup CSS
app.use("/css", express.static(__dirname + '/public/css'))


//setup middleware
const jsonParser = bodyParser.json();


//GET requests
app.get('/', (req, res) => {

    fetch('http://localhost:3004/messages')
        .then(response => {
            response.json().then(json => {
                res.render('home', {
                    articles: json
                })
            })
        }).catch(error => {
            console.log(error)
    })

})


app.get('/add_note', (req, res) => {
    res.render('add_note');
})


app.get('/edit_note/:id', (req, res) => {
    fetch(`http://localhost:3004/messages/${req.params.id}`)
        .then(response => {
            response.json().then(json => {
                res.render('edit_note', {
                    articles: json
                })
            })
        })
})



//POST requests with jsonParser middleware
app.post('/api/add_note', jsonParser, (req, res) => {

    fetch('http://localhost:3004/messages',{
            method: 'POST',
            body: JSON.stringify(req.body),
            headers:{
                'Content-type': 'application/json'
        }
    }).then((response)=> {
        res.status(200).send()
    })

})


//DELETE
app.delete('/api/delete/:id', (req, res) => {
    const id = req.params.id;
    fetch(`http://localhost:3004/messages/${id}`, {
        method: 'DELETE',
    }).then(response => {
        res.status(200).send();
    })
})


//UPDATE
app.patch('/api/edit_note/:id', jsonParser, (req, res) => {
    const id = req.params.id;

    fetch(`http://localhost:3004/messages/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(req.body),
        headers: {
            'Content-Type' : 'application/json'
        }
    }).then(response => {
        res.status(200).send();
    })
})



//PORT SETUP
const port = process.env.PORT || 3000;
app.listen(port, ()=>{
    console.log(`Magic happens on port ${port}`)
})