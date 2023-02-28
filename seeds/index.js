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
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            author: '638673ee43b7f6355c333323',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description: 'Welcomes you, your family, your friends and even your beloved pets to experience fresh air, woodlands, mountain streams, rolling surfs, wildflowers, star-studded skies, critters, crackling campfires and glowing marshmallows on a stick.',
            price,
            images: [
                {
                    url: 'https://res.cloudinary.com/dfyigb1ub/image/upload/v1670433229/YelpCamp/rks2bj1uakijumos3cwm.jpg',
                    filename: 'YelpCamp/rks2bj1uakijumos3cwm'
                },
                {
                    url: 'https://res.cloudinary.com/dfyigb1ub/image/upload/v1670433229/YelpCamp/f60w1pnquidsehx7tpuv.jpg',
                    filename: 'YelpCamp/f60w1pnquidsehx7tpuv'
                },
                {
                    url: 'https://res.cloudinary.com/dfyigb1ub/image/upload/v1670433229/YelpCamp/l3k6rsuei6cfiljkrcq8.jpg',
                    filename: 'YelpCamp/l3k6rsuei6cfiljkrcq8'
                }
            ]
        })
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})