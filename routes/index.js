var express = require('express');
var router = express.Router();



/* GET home page. */
router.get('/', function(req, res, next) {
  var db = req.db;
  var stories = db.get('stories');

  stories.find({}, function(err, data){
    res.render('index', { title: 'Galvanize Gazzette', stories: data });
  })
});

router.post('/', function (req, res, next){
  var db = req.db;
  var stories = db.get('stories');

  stories.insert({
    title: req.body.title,
    link: req.body.link,
    image: req.body.image,
    summary: req.body.summary,
    opinions: []
  }).then(function(){
    res.redirect('/');
  })
})

router.get('/stories/:id', function (req, res, next){
  var db = req.db;
  var stories = db.get('stories');

  stories.find({_id: req.params.id}, function (err, data){

    var opinionArray = data[0].opinions.join(' ').split(' ');
    console.log(opinionArray);

    var excludedWords = ["a", "the", "and", "or", "an", "John", "Cena", "John Cena", "of", "it", ""];

    var wordObject = opinionArray.reduce(function (prev, curr){
      if (excludedWords.indexOf(curr) === -1){
        prev[curr.toLowerCase()] ? prev[curr.toLowerCase()]++ : prev[curr.toLowerCase()] = 1;
      }
      return prev;
    }, {})

    console.log(wordObject)
    res.render('story', {title: data[0].title, story: data[0], words: wordObject })
  })
})

router.post('/stories/:id', function(req, res, next){
  var db = req.db;
  var stories = db.get('stories');

  stories.update({_id: req.params.id}, 
    { $push: { opinions: req.body.opinion }}).then(function(){
      res.redirect('/stories/' + req.params.id);
    })
})

module.exports = router;
