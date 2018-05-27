const program = require('commander');

const BaseParser = require('./lib/parsers/BaseParser');
const Lyrics = require('./lib/templates/Lyrics')
const MusicArticle = require('./lib/templates/MusicArticle');

let parsingTemplate
let Template

program
  .version('0.0.1')
  .arguments('<template>')
  .action(function (template) {
    parsingTemplate = template
  })
  .option('-j, --json <path to json file>', 'Load supplementary data from a JSON file')
  .option('-m, --musicbrainz <musicbrainz uuid>', 'Fetch a release by MusicBrainz UUID')
  .parse(process.argv)

switch (parsingTemplate.toLowerCase()) {
  case 'lyrics': {
    Template = Lyrics
    break
  }
  case 'musicarticle': {
    Template = MusicArticle
    break
  }
}

BaseParser.prepare({
  json: program.json,
  musicbrainz: program.musicbrainz
}).then(async function(parser) {
  let instance = new Template(parser);
  return await instance.parse();
}).then(function(wikitext) {
  // eslint-disable-next-line no-console
  console.log(wikitext);
}).catch(function(error) {
  // eslint-disable-next-line no-console
  console.error(error);
});
