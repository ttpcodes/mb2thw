module.exports = async function (parser) {
  let workObj = await parser.get(parser.types.OBJECT, {
    Input: async () => {
      let getWorks = true;
      let works = {};
      while (getWorks) {
        if (await parser.get(parser.types.BOOLEAN, {
          Input: 'Are there additional works this track is based off of?'
        })) {
          let getTracks = true;
          let tracks = [];
          while (getTracks) {
            if (await parser.get(parser.types.BOOLEAN, {
              Input: 'Are there more tracks from the same work serving as the basis for this track?'
            })) {
              tracks.push(await parser.get(parser.types.STRING, {
                Input: 'What is the title of the original track?'}
              ));
            } else {
              getTracks = false;
            }
          }
          works[await parser.get(parser.types.STRING, {
            Input: 'Which work did the preceding tracks come from?'
          })] = tracks;
        } else {
          getWorks = false;
        }
      }
      return works;
    }
  });
  let works = '';
  for (let work in workObj) {
    works += workObj[work].map(function(track) {
      return `* original title: ${track}\n`;
    }).join('') + `* source: ${work}\n`;
  }
  return works
}
