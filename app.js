var createError = require('http-errors');
var express = require('express');
var path = require('path');
const ejs = require('ejs');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require('mongoose');
var router = express.Router();
var bodyParser = require('body-parser');
var cors = require('cors');


const port = 5000;

var app = express();
app.use(cors());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
require('dotenv').config();

mongoose.connect(`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.1kwptpo.mongodb.net/?retryWrites=true&w=majority/blog`);

const postSchema = {
  title: String,
  content: String
};

const Post = mongoose.model("Post", postSchema);

// home route
app.get('/', (req, res, next) => {
  Post.find({}, (err, posts) => {
    res.render('home', {
      posts: posts,
    });
  });
});

app.get('/api', (req, res, next) => {
  Post.find({}, (err, posts) => {
    res.json(posts);
  });
})

// compose route
app.get('/compose', (req, res, next) => {
  res.render('compose');
});

// creating new post
app.post('/compose', (req, res) => {
  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody
  });
  post.save(err => {
    if (!err){
        res.redirect("/");
    }
  });
});

// renders specific blog-post user clicks on
app.get("/posts/:postId", (req, res) => {

  const requestedPostId = req.params.postId;
    Post.findOne({_id: requestedPostId}, (err, post) => {
      res.render("post", {
        title: post.title,
        content: post.content
      });
    });
  });


// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.listen(port, () => console.log(`Listening on port ${port}`));

module.exports = app;
