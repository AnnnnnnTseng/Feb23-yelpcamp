const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/campground');

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    // useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)];

// const path = require('path');

const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 300; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            author: '63fd5ba88ec98c006f5d4eeb',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description: 'Welcomes you, your family, your friends and even your beloved pets to experience fresh air, woodlands, mountain streams, rolling surfs, wildflowers, star-studded skies, critters, crackling campfires and glowing marshmallows on a stick.',
            price,
            geometry: {
                type: 'Point',
                coordinates: [
                    cities[random1000].longitude,
                    cities[random1000].latitude,
                ]
            },
            images: [
                {
                    url: 'https://res.cloudinary.com/dfyigb1ub/image/upload/v1677630764/YelpCamp/rnhscchjcbm1z4klxkfp.jpg',
                    filename: 'YelpCamp/rnhscchjcbm1z4klxkfp'
                },
                {
                    url: 'https://res.cloudinary.com/dfyigb1ub/image/upload/v1677630764/YelpCamp/qjiu3t9wls3xlvhopsge.jpg',
                    filename: 'YelpCamp/qjiu3t9wls3xlvhopsge'
                }
            ]
        })
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})