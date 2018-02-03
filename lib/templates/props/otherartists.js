module.exports = async function(parser) {
  let data = await parser.get(parser.types.OBJECT, {
    Input: async function() {
      let getArtists = true;
      let otherArtists = {};
      while (getArtists) {
        if (await parser.get(parser.types.BOOLEAN, {
          Input: 'Are there other roles that artists fill?'
        })) {
          let role = await parser.get(parser.types.STRING, {
            Input: 'Which other role did artists fill?'
          });
          let artists = await parser.get(parser.types.ARRAY, {
            Input: 'Which artists filled that role?'
          });
          otherArtists[role] = artists;
        } else {
          getArtists = false;
        }
      }
      return otherArtists;
    },
    MusicBrainz: {
      data: 'relations',
      key: 'album/./otherStaff'
    }
  });
  let wikitext = '| other_staff =\n';
  for (let role in data) {
    wikitext += `; ${role}\n` +
    data[role].map(function(artist) {
      return `: ${artist}\n`;
    }).join('');
  }
  return wikitext;
}
