const expect = require('chai').expect;
const fs = require('mz/fs');

const BaseParser = require('../../lib/parsers/BaseParser');
const MusicArticle = require('../../lib/templates/MusicArticle');

describe('music article parser', function() {
  let text = null;

  before(function(done) {
    fs.readFile(`${__dirname}/../wikitext.txt`, 'utf8').then(function(file) {
      text = file;
      done();
    });
  });

  it('outputs a music article template', async function() {
    let wikitext = await BaseParser.prepare({
      json: `${__dirname}/../test.json`,
      musicbrainz: '1fea8147-b511-4a76-a412-66337e6501ff'
    }).then(async function(parser) {
      let template = new MusicArticle(parser);
      return await template.parse();
    });
    // If this line lies inside a Promise, mocha refuses to provide proper test debugging information.
    expect(wikitext).to.equal(text);
  }).timeout(5000);
});
