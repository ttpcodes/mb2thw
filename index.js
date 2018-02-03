const program = require('commander');

const BaseParser = require('./lib/parsers/BaseParser');
const MusicArticle = require('./lib/templates/MusicArticle');

program
  .version('0.0.1');

BaseParser.prepare().then(async function(parser) {
  let template = new MusicArticle(parser);
  return await template.parse();
}).then(function(wikitext) {
  // eslint-disable-next-line no-console
  console.log(wikitext);
}).catch(function(error) {
  // eslint-disable-next-line no-console
  console.error(error);
});
