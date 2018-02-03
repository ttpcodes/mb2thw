const program = require('commander');

const BaseParser = require('./lib/parsers/BaseParser');
const MusicArticle = require('./lib/templates/MusicArticle');

program
  .version('0.0.1')
  .option('-j, --json <path to json file>', 'Load supplementary data from a JSON file')
  .option('-m, --musicbrainz <musicbrainz uuid>', 'Fetch a release by MusicBrainz UUID')
  .parse(process.argv);

BaseParser.prepare({
  json: program.json,
  musicbrainz: program.musicbrainz
}).then(async function(parser) {
  let template = new MusicArticle(parser);
  return await template.parse();
}).then(function(wikitext) {
  // eslint-disable-next-line no-console
  console.log(wikitext);
}).catch(function(error) {
  // eslint-disable-next-line no-console
  console.error(error);
});
