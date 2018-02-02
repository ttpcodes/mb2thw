const Util = require('../../Util');

module.exports = async function(parser) {
  let tracks = '';
  let number = parseInt(await parser.get(parser.types.STRING, {
    Input: 'How many tracks are on this album?'
  }));
  for (let i = 1; i <= number; i++) {
    let title = await parser.get(parser.types.STRING, {
      Input: 'What is the title of the track?'
    });
    let titleen;
    if (title.match(Util.japanese)) {
      titleen = await parser.get(parser.types.STRING, {
        Input: 'What is the translated title of the track?' || '___',
        Json: `tracks/./${i}/./titleen`
      });
    }
    let length = await parser.get(parser.types.STRING, {
      Input: 'What is the length of the track?'
    });
    let lyricPage = await parser.get(parser.types.BOOLEAN, {
      Input: 'Does this track have lyrics?'
    });
    let arrangement = await parser.get(parser.types.STRING, {
      Input: 'Which artists arranged this track?'
    });
    let lyrics = await parser.get(parser.types.STRING, {
      Input: 'Which artists wrote lyrics for this track?'
    });
    let vocals = await parser.get(parser.types.STRING, {
      Input: 'Which vocalists sang on this track?'
    });
    let otherArtistObj = await parser.get(parser.types.OBJECT, {
      Input: async () => {
        let checkOthers = true;
        let otherArtists = {};
        while (checkOthers) {
          if (await parser.get(parser.types.BOOLEAN, {
            Input: 'Are there other roles that artists fill?'
          })) {
            let role = await parser.get(parser.types.STRING, {
              Input: 'Which other role did artists fill?'
            });
            let artists = await parser.get(parser.types.STRING, {
              Input: 'Which artists filled that role?'
            });
            otherArtists[role] = artists;
          } else {
            checkOthers = false;
          }
        }
        return otherArtists;
      }
    });
    let otherArtists = '';
    for (let role in otherArtistObj) {
      otherArtists += `** ${role}: ${otherArtistObj[role]}\n`
    }
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
      },
      Json: `tracks/./${i}/./works`
    });
    let works = '';
    for (let work in workObj) {
      works += workObj[work].map(function(track) {
        return `** original title: ${track}\n`;
      }).join('') + `** source: ${work}\n`;
    }
    tracks += `* {{Track|${i}|${title}|${length}${lyricPage ? '|lyrics=Lyrics: ' + title : ''}}}\n` +
      (titleen ? `** ''${titleen}''\n` : '') +
      (arrangement ? `** arrangement: ${arrangement}\n` : '') +
      (lyrics ? `** lyrics: ${lyrics}\n` : '') +
      (vocals ? `** vocals: ${vocals}\n` : '') +
      otherArtists +
      works;
  }
  return tracks;
}
