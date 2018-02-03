module.exports = async function(type, parser) {
  let artists = await parser.get(parser.types.ARRAY, {
    Input: 'Which artists served the role of ' + type + '?',
    MusicBrainz: {
      data: 'relations',
      key: `album/./${type + 's'}`
    }
  });
  return `| ${type} =\n` +
    artists.map(function(artist) {
      return `${artist}\n`
    }).join(': ');
}
