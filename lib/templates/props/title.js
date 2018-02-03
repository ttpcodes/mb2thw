const Util = require('../../Util');

module.exports = async function(parser) {
  let title = await parser.get(parser.types.STRING, {
    Input: 'What is the title of the album?',
    MusicBrainz: 'title'
  });
  // https://stackoverflow.com/questions/43418812/check-whether-a-string-contains-japanese-chinese-characters
  if (title.match(Util.japanese)) {
    let titlejprom = await parser.get(parser.types.STRING, {
      Input: 'What is the romanized title of the album?',
      Json: 'album/./titlejprom'
    });
    let titleen = await parser.get(parser.types.STRING, {
      Input: 'What is the translated title of the album?',
      Json: 'album/./titleen'
    });
    return `| titlejp = ${title}\n` +
      `| titlejprom = ${titlejprom}\n` +
      `| titleen = ${titleen}\n`;
  } else {
    return `| titleen = ${title}\n`;
  }
}
