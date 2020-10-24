require("dotenv").config()
const express = require("express");
const axios = require("axios");
const app = express();
const ejsLayouts = require("express-ejs-layouts");
const db = require("./models");

app.set("view engine", "ejs");
app.use(ejsLayouts);
app.use(express.urlencoded({extended: false}));
// makes it so we get the json data into req.body [parses the form data]
// used everytime you want to get data from post route

console.log(process.env.API_KEY)
console.log(process.env.PORT)

// HOME ROUTE > index.ejs
app.get("/", (req, res) => {
    res.render("index");
});

// MOVIE ROUTE > results.ejs
app.get("/movies", (req, res) => {
    let movie = req.query.q
    var qs = {
        params: {
            s: movie,
            apikey: `${process.env.API_KEY}`
        }
    }
    axios.get("http://www.omdbapi.com", qs) // axios.get instead of axios.fetch
    .then(response => { // similar to fetch! 
        //handle success
        let results = response.data.Search
        res.render("results" , {movies: results})
        // console.log(results)
    })
    .catch(err => {
        console.log(err)
    })
});

// MOVIE DETAILS ROUTE > show ejs
app.get("/movies/:movie_id", (req, res) => {
    let IMDBid = req.params.movie_id
    var qs = {
        params: {
            i: IMDBid,
            apikey: `${process.env.API_KEY}`
        }
    }
    axios.get("http://www.omdbapi.com", qs) // axios.get instead of axios.fetch
    .then(response => { // similar to fetch! 
        //handle success
        let movieDetails = response.data
        res.render("show" , {movie: movieDetails})
        // console.log(movieDetails)
    })
    .catch(err => {
        console.log(err)
    })
});

// FAVES ROUTES > favorites.ejs
// app.get to get all the faves from database
app.get("/faves", (req, res) => {
    db.fave.findAll()
    .then((favorite) => {
        res.render("faves", {favorites: favorite})
    })
});

// app.post > redirect to /favorites
app.post("/faves", (req, res) => {
    console.log("Form Data:", req.body)
    db.fave.findOrCreate({
        where: {title: req.body.title},
        defaults: {imdbid: req.body.imdbid}
    }).then(([createdFave, wasCreated]) => {
        console.log("Fave Movie Created:", createdFave);
        res.redirect("faves");
    }).catch(err => {
        console.log(err)
    })
})

app.listen(process.env.PORT, () => {
    console.log("It works!")
});