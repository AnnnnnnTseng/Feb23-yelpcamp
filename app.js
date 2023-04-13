if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}


const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
const ExpressError = require('./utils/ExpressError');
const methodOverride = require('method-override');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');
const helmet = require('helmet');


const mongoSanitize = require('express-mongo-sanitize');



//把route另開檔案存放
const userRoutes = require('./routes/users');
const campgroundsRoutes = require('./routes/campgrounds');
const reviewsRoutes = require('./routes/reviews');


// //??
const { Console } = require('console');
const { runInNewContext } = require('vm');
const ExpressMongoSanitize = require('express-mongo-sanitize');



mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    //useCreateIndex: true,
    useUnifiedTopology: true,
    //useFindAndModify: false
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const app = express();

//美化code的ejs延伸工具
app.engine('ejs', ejsMate);

//view dir/裝入網頁模板EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

//app.post要parse req.body
app.use(express.urlencoded({ extended: true }))
//讓express可以用app.put
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')))
//防Mongo Injection
app.use(mongoSanitize())
//session for flashing msg
const sessionConfig = {
    name: 'session',
    secret: 'thisshouldbeabettersecret!',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        //secure: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 3,
        maxAge: 1000 * 60 * 60 * 24 * 3
    }
}
app.use(session(sessionConfig))
app.use(flash());
// app.use(helmet());

// const scriptSrcUrls = [
//     "https://stackpath.bootstrapcdn.com/",
//     "https://api.tiles.mapbox.com/",
//     "https://api.mapbox.com/",
//     "https://kit.fontawesome.com/",
//     "https://cdnjs.cloudflare.com/",
//     "https://cdn.jsdelivr.net",
// ];
// const styleSrcUrls = [
//     "https://kit-free.fontawesome.com/",
//     "https://stackpath.bootstrapcdn.com/",
//     "https://api.mapbox.com/",
//     "https://api.tiles.mapbox.com/",
//     "https://fonts.googleapis.com/",
//     "https://use.fontawesome.com/",
// ];
// const connectSrcUrls = [
//     "https://api.mapbox.com/",
//     "https://a.tiles.mapbox.com/",
//     "https://b.tiles.mapbox.com/",
//     "https://events.mapbox.com/",
// ];
// const fontSrcUrls = [];
// app.use(
//     helmet.contentSecurityPolicy({
//         directives: {
//             defaultSrc: [],
//             connectSrc: ["'self'", ...connectSrcUrls],
//             scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
//             styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
//             workerSrc: ["'self'", "blob:"],
//             objectSrc: [],
//             imgSrc: [
//                 "'self'",
//                 "blob:",
//                 "data:",
//                 "https://console.cloudinary.com/console/c-baf5653f5906f2a987b3d15a6a5568/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT! 
//                 "https://images.unsplash.com/",
//             ],
//             fontSrc: ["'self'", ...fontSrcUrls],
//         },
//     })
// );





//passport - authentication tool
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
//how to store and unstore user
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    console.log(req.query);
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals, error = req.flash('error');
    next();
})

//Routes
//另開檔案存放route並讓route前自動灌入一些路徑
app.use('/', userRoutes)
app.use('/campgrounds', campgroundsRoutes)
app.use('/campgrounds/:id/reviews', reviewsRoutes)



app.get('/', (req, res) => {
    res.render('home')
})


//沒找到URL的頁面都會跳到這
app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
});


//Error Handler Middleware
app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh No, Something Went Wrong!'
    res.status(statusCode).render('error', { err });
})


//localhost
app.listen(3300, () => {
    console.log('serving on port 3300')
})