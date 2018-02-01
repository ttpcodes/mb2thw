const InputParser = require('../parsers/BaseParser.js');
const Util = require('../Util');

class MusicArticle {
  static async musictype() {

    switch(await InputParser.get(InputParser.types.STRING, {
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

  static async title() {
    let title = await InputParser.get(InputParser.types.STRING, {
      Input: 'What is the title of the album?'
    });
    // https://stackoverflow.com/questions/43418812/check-whether-a-string-contains-japanese-chinese-characters
    if (title.match(Util.japanese)) {
      let titlejprom = await InputParser.get(InputParser.types.STRING, {
        Input: 'What is the romanized title of the album?'
      });
      let titleen = await InputParser.get(InputParser.types.STRING, {
        Input: 'What is the translated title of the album?'
      });
      return `| titlejp = ${title}\n` +
        `| titlejprom = ${titlejprom}\n` +
        `| titleen = ${titleen}\n`;
    } else {
      return `| titleen = ${title}\n`;
    }
  }

  static async group() {
    let group = await InputParser.get(InputParser.types.STRING, {
      Input: 'What is the name of the group?'
    });
    if (group.match(Util.japanese)) {
      let groupCat = await InputParser.get(InputParser.types.STRING, {
        Input: 'What is the romanized name of the group?'
      });
      return `| group = [[${group}|${groupCat}]]\n` +
        `| groupCat = ${groupCat}\n`;
    } else {
      return `| group = ${group}\n`
    }
  }

  static async genres() {
    let genres = await InputParser.get(InputParser.types.ARRAY, {
      Input: 'What genres are on this album?'
    });
    return '| genre = ' + genres.map(function(genre) {
      return `{{Genre|${genre}}}`;
    }).join(', ') + '\n';
  }

  static async artists(type) {
    let artists = await InputParser.get(InputParser.types.ARRAY, {
      Input: 'Which artists served the role of ' + type + '?'
    });
    return `| ${type} = ` +
      artists.map(function(artist) {
        return `${artist}\n`
      }).join(': ');
  }

  static async otherArtists(recur) {
    let otherArtists = ''
    if (await InputParser.get(InputParser.types.BOOLEAN, {
      Input: 'Are there other roles that artists fill?'
    })) {
      let role = await InputParser.get(InputParser.types.STRING, {
        Input: 'Which other role did artists fill?'
      });
      let artists = await InputParser.get(InputParser.types.STRING, {
        Input: 'Which artists filled that role?'
      });
      otherArtists += (recur ? '' : `| other_staff =\n`) +
        `; ${role}\n` +
        artists.map(function(artist) {
          return `: ${artist}\n`;
        }).join('') + await MusicArticle.otherArtists(true);
    }
    return otherArtists;
  }

  static async autogendesc() {
    return await InputParser.get(InputParser.types.STRING, {
      Input: {
        message: 'What arrangements exist on this album?',
        choices: ['vocal', 'instrumental', 'vocal and instrumental', '?']
      }
    });
  }

  static async tracks() {
    let tracks = '';
    let number = parseInt(await InputParser.get(InputParser.types.STRING, {
      Input: 'How many tracks are on this album?'
    }));
    for (let i = 1; i <= number; i++) {
      let title = await InputParser.get(InputParser.types.STRING, {
        Input: 'What is the title of the track?'
      });
      let titleen;
      if (title.match(Util.japanese)) {
        titleen = await InputParser.get(InputParser.types.STRING, {
          Input: 'What is the translated title of the track?' || '___'
        });
      }
      let length = await InputParser.get(InputParser.types.STRING, {
        Input: 'What is the length of the track?'
      });
      let lyricPage = await InputParser.get(InputParser.types.BOOLEAN, {
        Input: 'Does this track have lyrics?'
      });
      let arrangement = await InputParser.get(InputParser.types.STRING, {
        Input: 'Which artists arranged this track?'
      });
      let lyrics = await InputParser.get(InputParser.types.STRING, {
        Input: 'Which artists wrote lyrics for this track?'
      });
      let vocals = await InputParser.get(InputParser.types.STRING, {
        Input: 'Which vocalists sang on this track?'
      });
      let checkOthers = true;
      let otherArtists = '';
      while (checkOthers) {
        if (await InputParser.get(InputParser.types.BOOLEAN, {
          Input: 'Are there other roles that artists fill?'
        })) {
          let role = await InputParser.get(InputParser.types.STRING, {
            Input: 'Which other role did artists fill?'
          });
          let artists = await InputParser.get(InputParser.types.STRING, {
            Input: 'Which artists filled that role?'
          });
          otherArtists += `** ${role}: ${artists}\n`;
        } else {
          checkOthers = false;
        }
      }
      let getWorks = true;
      let works = '';
      while (getWorks) {
        if (await InputParser.get(InputParser.types.BOOLEAN, {
          Input: 'Are there additional works this track is based off of?'
        })) {
          let getTracks = true;
          while (getTracks) {
            if (await InputParser.get(InputParser.types.BOOLEAN, {
              Input: 'Are there more tracks from the same work serving as the basis for this track?'
            })) {
              works += `** original title: ${await InputParser.get(InputParser.types.STRING, {
                Input: 'What is the title of the original track?'}
              )}\n`
            } else {
              getTracks = false;
            }
          }
          works += `** source: ${await InputParser.get(InputParser.types.STRING, {
            Input: 'Which work did the preceding tracks come from?'})
          }\n`;
        } else {
          getWorks = false;
        }
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

  static async parse() {
    return `{{MusicArticle\n` +
      await MusicArticle.musictype() +
      await MusicArticle.title() +
      await MusicArticle.group() +
      `| released    =${await InputParser.get(InputParser.types.STRING, {
        Input: 'When was this album released?'
      })}\n` +
      `| convention  =${await InputParser.get(InputParser.types.STRING, {
        Input: 'Which convention was this album released at?'
      })}\n` +
      `| tracks      =${await InputParser.get(InputParser.types.STRING, {
        Input: 'How many tracks are on the album?'
      })}\n` +
      `| length      =${await InputParser.get(InputParser.types.STRING, {
        Input: 'What is the running length of the album?'
      })}\n` +
      `| catalogno   =${await InputParser.get(InputParser.types.STRING, {
        Input: 'What is the catalog number of the album?'
      })}\n` +
      await MusicArticle.genres() +
      `| website     =${await InputParser.get(InputParser.types.STRING, {
        Input: "What is the URL to the album's discography entry?"
      })}\n` +
      `| image       =${await InputParser.get(InputParser.types.STRING, {
        Input: 'What is the filename of the cover art?'
      })}\n` +
      `| caption     =${await InputParser.get(InputParser.types.STRING, {
        Input: 'Would you like to add an optional caption for the cover art?'
      })}\n` +
      `| banner      =${await InputParser.get(InputParser.types.STRING, {
        Input: 'What is the filename of the article banner?'}
      )}\n` +
      `| banner_res  =${await InputParser.get(InputParser.types.STRING, {
        Input: 'Would you optionally like to set the resolution of the banner?'
      })}\n` +
      // `| multicolumn =Set to allow for multiple staff credits columns\n` +
      await MusicArticle.artists('arranger') +
      await MusicArticle.artists('lyricist') +
      await MusicArticle.artists('vocalist') +
      await MusicArticle.artists('producer') +
      await MusicArticle.artists('illustrator') +
      await MusicArticle.artists('designer') +
      await MusicArticle.artists('masterer') +
      await MusicArticle.otherArtists() +
      // `| no_intro    =Set this value to remove the first template generated sentence\n` +
      // `| non_album   =Set for non-albums\n` +
      `| autogendesc =${await MusicArticle.autogendesc()}\n` +
      // `| description =Information to put after the introduction before the Staff section\n` +
      `| tracklist   =\n${await MusicArticle.tracks()}\n` +
      `| notes       =\n` +
      `| review      =\n` +
      `| print_references =\n` +
      `}}\n`;
  }
}

module.exports = MusicArticle;
