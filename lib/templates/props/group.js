const Util = require('../../Util');

module.exports = async function(parser, useLyricsKey) {
  let group = await parser.get(parser.types.STRING, {
    Input: 'What is the name of the group?',
    MusicBrainz: 'artist-credit/./0/./name'
  });
  if (group.match(Util.japanese)) {
    let groupCat = await parser.get(parser.types.STRING, {
      Input: 'What is the romanized name of the group?',
      Json: 'album/./groupCat'
    });
    return `| group = [[${group}|${groupCat}]]\n` +
      `| ${useLyricsKey ? 'group_en' : 'groupCat' } = ${groupCat}\n`;
  } else {
    return `| group = ${group}\n`
  }
}
