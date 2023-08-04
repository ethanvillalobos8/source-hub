if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const flash = require('express-flash');
const session = require('express-session');
const methodOverride = require('method-override');

const initializePassport = require('./passport-config');
const passport = require('passport');
initializePassport(
    passport, 
    email => users.find(user => user.email === email), 
    id => users.find(user => user.id === id)
);

// Test data
const users = [];

// View engine
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));
app.use(flash());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride('_method'));

// Middleware
app.use(express.json());

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
        const user = {
            id: Date.now().toString(),
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword
        };
        users.push(user);
        res.redirect('/login');
    } catch (error) {
        res.render('register.ejs', { error: 'Error during registration. Please try again.' });
    }
    console.log(users);
});

app.get('/users', (req, res) => {
    res.json(users);
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

app.listen(3000);