const Util = require('../../Util');

module.exports = async function(parser) {
  let group = await parser.get(parser.types.STRING, {
    Input: 'What is the name of the group?'
  });
  if (group.match(Util.japanese)) {
    let groupCat = await parser.get(parser.types.STRING, {
      Input: 'What is the romanized name of the group?'
    });
    return `| group = [[${group}|${groupCat}]]\n` +
      `| groupCat = ${groupCat}\n`;
  } else {
    return `| group = ${group}\n`
  }
}
