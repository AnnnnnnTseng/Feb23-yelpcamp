const express = require('express');
const router = express.Router();
const campgrounds = require('../controllers/campgrounds');
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, isAuthor, validateCampground } = require('../middleware');
//upload image
const multer = require('multer')
const { storage } = require('../cloudinary');
const upload = multer({ storage });

const Campground = require('../models/campground');



//ROUTES


//all campgrounds display page
router.route('/')
    .get(catchAsync(campgrounds.index))
    .post(isLoggedIn, upload.array('image'), validateCampground, catchAsync(campgrounds.createCampground))


//.post(upload.array('image'), (req, res) => {
//console.log(req.body, req.files);
//  res.send('YAA')
//})

//add new campground
router.get('/new', isLoggedIn, campgrounds.renderNewForm)



//individual campground page 
router.route('/:id')
    .get(catchAsync(campgrounds.showCampground))
    .put(isLoggedIn, isAuthor, upload.array('image'), validateCampground, catchAsync(campgrounds.updateCampground))
    .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground));

//edit page
router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm))





module.exports = router;