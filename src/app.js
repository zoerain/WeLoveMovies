if (process.env.USER) require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const moviesRouter = require('./movies/movies.router');

app.use(cors());
app.use(express.json());

app.use('/movies', moviesRouter);

//Error Handler
app.use((req, res, next) => {
    next({
        status: 500,
        message: 'Something went wrong!'
    });
});

//Not Found Handler
app.use((req, res, next) => {
    next({
      status: 404,
      message: `Not found: ${req.originalUrl}`,
    });
});


module.exports = app;
