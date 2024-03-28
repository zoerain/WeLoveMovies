const asyncErrorBoundary = require('../errors/asyncErrorBoundary');
const reviewsService = require('./reviews.service');

async function reviewExists(req, res, next) {
    const review = await reviewsService.read(req.params.reviewId);
    if (review) {
        res.locals.review = review;
        return next();
    }
    return next({
        status: 404,
        message: 'Review cannot be found',
    });
};

async function read(req, res, next) {
    const reviewId = res.locals.review.review_id;
    res.json({ data: await reviewsService.read(reviewId) });
};

async function update(req, res, next) {
    const reviewId = res.locals.review.review_id;
    
    const updatedReview = {
        ...req.body.data,
        review_id: res.locals.review.review_id,
    };
    await reviewsService.update(updatedReview);
    res.json({ data: await reviewsService.read(reviewId) });
};

async function destroy(req, res, next) {
    const reviewId = res.locals.review.review_id;
    await reviewsService.destroy(reviewId);
    res.sendStatus(204);
};

module.exports = {
  update: [asyncErrorBoundary(reviewExists), asyncErrorBoundary(update)],
  destroy: [asyncErrorBoundary(reviewExists), asyncErrorBoundary(destroy)],
};