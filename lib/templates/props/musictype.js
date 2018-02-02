module.exports = async function(parser) {
  switch(await parser.get(parser.types.STRING, {
    Input: {
      message: 'What type of album is this?',
      choices: ['Official CDs', 'Original CDs', 'Other']
    }
  })) {
    case 'Official CDs': {
      return '| musictype = Official CDs\n';
    }
    case 'Original CDs': {
      return '| musictype = Original CDs\n'
    }
    default: {
      return '';
    }
  }
}
