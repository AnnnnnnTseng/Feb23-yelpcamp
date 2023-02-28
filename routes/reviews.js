const express = require('express');
const router = express.Router({ mergeParams: true });
const reviews = require('../controllers/review')
const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware');
const Campground = require('../models/campground');
const Review = require('../models/review');

//const { reviewSchema } = require('../schemas.js');

const ExpressError = require('../utils/ExpressError');
const catchAsync = require('../utils/catchAsync');



//routes
//add review
router.post('/', isLoggedIn, validateReview, catchAsync(reviews.createReview))

//delete review
router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview))


module.exports = router;