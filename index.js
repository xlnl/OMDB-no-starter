require("dotenv").config()
const express = require("express");
const axios = require("axios");
const app = express();
const ejsLayouts = require("express-ejs-layouts");

app.set("view engine", "ejs");
app.use(ejsLayouts);
app.use(express.urlencoded({extended: false}));

console.log(process.env.API_KEY)
console.log(process.env.PORT)

// HOME ROUTE
app.get("/", (req, res) => {
    res.render("index");
});

// MOVIE ROUTE 
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
        console.log(results)
    })
    .catch(err => {
        console.log(err)
    })
});

// MOVIE DETAILS ROUTE
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
        console.log(movieDetails)
    })
    .catch(err => {
        console.log(err)
    })
});


app.listen(3000, () => {
    console.log("It works!")
});