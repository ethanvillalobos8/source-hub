if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const password = process.env.SECRET_KEY;

const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const flash = require('express-flash');
const session = require('express-session');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const User = require('./user.model');

const MongoDBStore = require('connect-mongodb-session')(session);

const store = new MongoDBStore({
    uri: `mongodb+srv://ethanvillalobos8:${password}@hub-cluster.05pds6x.mongodb.net/resource-hub?retryWrites=true&w=majority`,
    collection: 'sessions'
});

store.on('error', function(error) {
    console.log(error);
});

const initializePassport = require('./passport-config');
const passport = require('passport');
initializePassport(
    passport,
    async email => await User.findOne({ email: email }),
    async id => await User.findById(id)
)

// Connecting to MongoDB Atlas
const connectionString = `mongodb+srv://ethanvillalobos8:${password}@hub-cluster.05pds6x.mongodb.net/resource-hub?retryWrites=true&w=majority`;

// Connecting to MongoDB
mongoose.connect(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Could not connect to MongoDB:', err));

mongoose.connection.on('connected', () => {
    console.log('Mongoose connected to', mongoose.connection.db.databaseName);
});

// View engine
app.set('view-engine', 'ejs')
app.use(express.urlencoded({ extended: false }))
app.use(flash())
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: store  // Use the MongoDB store for sessions
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))

// Middleware
app.use(express.json());

// Serve static files
app.use(express.static('source'));

// Stylesheets
app.use(express.static('styles'));

app.get('/', checkAuthenticated, (req, res) => {
    res.render('index.ejs', { username: req.user.username });
});

app.get('/login', checkNotAuthenticated, (req, res) => {
    res.render('login.ejs');
});

// POST request
app.post('/login', checkNotAuthenticated, passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}));

app.get('/register', checkNotAuthenticated, (req, res) => {
    res.render('register.ejs');
});

// POST request
app.post('/register', checkNotAuthenticated, async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const user = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword
        });
        await user.save();
        res.redirect('/login');
    } catch (error) {
        res.render('register.ejs', { error: 'Error during registration. Please try again.' });
    }
});

app.delete('/logout', (req, res) => {
    req.logout(function (err) {
        if (err) {
            console.error('Error occurred during logout:', err);
            return res.status(500).send('Internal Server Error');
        }
        res.redirect('/login');
    });
});

// POST request to add a link
app.post('/add-link', checkAuthenticated, async (req, res) => {
    try {
        const { linkName, linkUrl } = req.body;
        const user = await User.findById(req.user.id);
        user.links.push({ name: linkName, url: linkUrl });
        await user.save();
        res.redirect('/');
    } catch (error) {
        console.error('Error during link addition:', error);
        res.status(500).send('Internal Server Error');
    }
});

// GET request to retrieve links
app.get('/get-links', checkAuthenticated, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        res.json(user.links);
    } catch (error) {
        console.error('Error during link retrieval:', error);
        res.status(500).send('Internal Server Error');
    }
});

// DELETE request to remove a link
app.delete('/delete-link/:linkId', checkAuthenticated, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        user.links.pull({ _id: req.params.linkId });
        await user.save();
        res.status(200).send('Link deleted');
    } catch (error) {
        console.error('Error during link deletion:', error);
        res.status(500).send('Internal Server Error');
    }
});

function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
};

function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect('/');
    }
    next();
};

const PORT = process.env.PORT || 3000;
app.listen(PORT, function() {
    console.log('Server is running on port ' + PORT);
});