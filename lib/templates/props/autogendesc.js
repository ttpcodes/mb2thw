module.exports = async function(parser) {
  return await parser.get(parser.types.STRING, {
    Input: {
      message: 'What arrangements exist on this album?',
      choices: ['vocal', 'instrumental', 'vocal and instrumental', '?']
    }
  });
}
