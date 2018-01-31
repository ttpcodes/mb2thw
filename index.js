const program = require('commander');

const MusicArticle = require('./lib/templates/MusicArticle');

program
  .version('0.0.1');

MusicArticle.parse().then(function(wikitext) {
  console.log(wikitext);
});
