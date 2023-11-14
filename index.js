var express = require('express');
var router = express.Router();
var path = require('path');
const bodyParser = require("body-parser");
var mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: String, // Use String type for username
    password: String,// Use String type for password
    visitedMovies: {
        type: [Number],
        default: []
    }
});

const User = mongoose.model("User", userSchema);
/* GET home page. */


//so that user cannot redirect to any page without any authentication. 
const session = require('express-session');
router.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true
}));
const isAuthenticated = (req, res, next) => {
    if (req.session.User) {
        next();
    } else {
        res.redirect('/loginpage');
    }
};


// this will give us the list of visited movies by a particular user and this link will be used in recommend.js file to recommend movies. 
router.get('/api/visitedMovies', isAuthenticated, async (req, res) => {
    try {
        const userId = req.session.User._id;
        const user = await User.findById(userId);
        res.json({ visitedMovies: user.visitedMovies.reverse() });
    } catch (error) {
        console.error('Error fetching visited movie IDs:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
//router.get('/recommend', isAuthenticated, async function (req, res, next) {
//    const userId = req.session.User._id;
//    const visitedMovieIds = await getVisitedMovieIds(userId);
//    const recommendations = await getMovieRecommendations(visitedMovieIds);

//    res.render('recommend', { movies: recommendations });
//});
router.get('/recommend', function (req, res, next) {
    res.sendFile(path.join(__dirname, '../public/recommend.html'));
});
router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/loginpage');
});
//router.get('/', function (req, res, next) {
//    res.sendFile(path.join(__dirname, '../public/loginpage.html'));
//});
router.get('/', isAuthenticated, function (req, res, next) {
       res.sendFile(path.join(__dirname, '../public/index2.html'));
        
});
router.get('/registerpage', function (req, res, next) {
    res.sendFile(path.join(__dirname, '../public/registerpage.html'));
});
router.get('/loginpage', function (req, res, next) {
    res.sendFile(path.join(__dirname, '../public/loginpage.html'));
});
router.get('/indexpage', isAuthenticated, function (req, res, next) {
    res.sendFile(path.join(__dirname, '../public/index2.html'));
});
router.get('/search', isAuthenticated, function (req, res, next) {
    res.sendFile(path.join(__dirname, '../public/search.html'));
});
router.get('/embedded', isAuthenticated, function (req, res, next) {
    res.sendFile(path.join(__dirname, '../public/embedded.html'));
});

router.get('/:id', isAuthenticated, function (req, res, next) {
    const userId = req.session.User._id;
    const movieId = parseInt(req.params.id); // Replace with your movie ID
    User.findById(userId)
        .then(user => {
            if (user) {
                user.visitedMovies.push(movieId);
                return user.save();
            } else {
                throw new Error('User not found');
            }
        })
        .then(() => {
            res.sendFile(path.join(__dirname, '../public/about.html'));
        })
        .catch(error => {
            console.log(error);
            // Handle the error appropriately
        });
    //res.sendFile(path.join(__dirname, '../public/about.html'));
});



router.post("/register", function (req, res) {
    const newuser = new User({
        email: req.body.username,
        password: req.body.password
    });
    newuser.save()
        .then(() => {
            req.session.User = newuser;
            res.sendFile(path.join(__dirname, '../public/index2.html'));
        })
        .catch((err) => {
            console.log(err);
        });
})
router.post("/login", function (req, res) {
    const username = req.body.username;
    const password = req.body.password;
    User.findOne({ email: username })
        .then(function (foundUser) {
            if (foundUser) {
                if (foundUser.password === password) {
                    req.session.User = foundUser;
                    res.sendFile(path.join(__dirname, '../public/index2.html'));
                }
                else {
                    res.sendfile(path.join(__dirname, '../public/loginpage.html'));
                    console.log("Incorrect password");
                    // Handle the case when the password is incorrect
                }
            }
            else {
                res.sendFile(path.join(__dirname, '../public/registerpage.html'));
                console.log("Not Registered");
                // Handle the case when the password is incorrect
            }
        })
        .catch(function (error) {
            console.log(error);
        });

});



module.exports = router;
