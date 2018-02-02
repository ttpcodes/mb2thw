module.exports = async function(parser) {
  let genres = await parser.get(parser.types.ARRAY, {
    Input: 'What genres are on this album?'
  });
  return '| genre = ' + genres.map(function(genre) {
    return `{{Genre|${genre}}}`;
  }).join(', ') + '\n';
}
