const moviesService = require('./movies.service');
const asyncErrorBoundary = require('../errors/asyncErrorBoundary');

async function list(req, res, next) {
    if (req.query && req.query.is_showing === true) {
        res.json({ data: await moviesService.listCurrentlyShowing() });
    }
    res.json({ data: await moviesService.list() });
};

async function movieExists(req, res, next) {
    const movie = moviesService.read(req.params.movieId);
    if (movie) {
        res.locals.movie = movie;
        return next();
    }
    next({
        status: 404,
        message: 'Movie cannot be found',
    });
};

async function read(req, res, next) {
    const movieId = res.locals.movie.movie_id;
    res.json({ data: await moviesService.read(movieId) });
};

async function readTheatersPlayingMovie(req, res, next) {
    const movieId = res.locals.movie.movie_id;
    res.json({ data: await moviesService.readTheatersPlayingMovie(movieId) });
};

async function readMovieReviews(req, res, next) {
    const movieId = res.locals.movie.movie_id;
    res.json({ data: await moviesService.readMovieReviews(movieId) });
};

module.exports = {
    list: asyncErrorBoundary(list),
    read: [ 
        asyncErrorBoundary(movieExists), 
        asyncErrorBoundary(read) ],
    readTheatersPlayingMovie: [ 
        asyncErrorBoundary(movieExists), 
        asyncErrorBoundary(readTheatersPlayingMovie) ],
    readMovieReviews: [ 
        asyncErrorBoundary(movieExists), 
        asyncErrorBoundary(readMovieReviews) ],
};
