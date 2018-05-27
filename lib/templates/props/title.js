const Util = require('../../Util');

/**
 * Fetches the block of content responsible for displaying the title in an article.
 * @param {boolean} useLyricsKey Specifies whether or not to use the lyrics version
 * of an argument name.
 */
module.exports = async function(parser, useLyricsKey) {
  let title = await parser.get(parser.types.STRING, {
    Input: `What is the title of the ${useLyricsKey ? 'track' : 'album'}?`,
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
      `| ${ useLyricsKey ? 'titlerom' : 'titlejprom' } = ${titlejprom}\n` +
      `| titleen = ${titleen}\n`;
  } else {
    return `| titleen = ${title}\n`;
  }
}
