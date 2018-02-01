// const this.parser = require('../parsers/BaseParser.js');
const Util = require('../Util');

class MusicArticle {
  constructor(parser) {
    this.parser = parser;
  }

  async musictype() {

    switch(await this.parser.get(this.parser.types.STRING, {
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

  async title() {
    let title = await this.parser.get(this.parser.types.STRING, {
      Input: 'What is the title of the album?'
    });
    // https://stackoverflow.com/questions/43418812/check-whether-a-string-contains-japanese-chinese-characters
    if (title.match(Util.japanese)) {
      let titlejprom = await this.parser.get(this.parser.types.STRING, {
        Input: 'What is the romanized title of the album?'
      });
      let titleen = await this.parser.get(this.parser.types.STRING, {
        Input: 'What is the translated title of the album?'
      });
      return `| titlejp = ${title}\n` +
        `| titlejprom = ${titlejprom}\n` +
        `| titleen = ${titleen}\n`;
    } else {
      return `| titleen = ${title}\n`;
    }
  }

  async group() {
    let group = await this.parser.get(this.parser.types.STRING, {
      Input: 'What is the name of the group?'
    });
    if (group.match(Util.japanese)) {
      let groupCat = await this.parser.get(this.parser.types.STRING, {
        Input: 'What is the romanized name of the group?'
      });
      return `| group = [[${group}|${groupCat}]]\n` +
        `| groupCat = ${groupCat}\n`;
    } else {
      return `| group = ${group}\n`
    }
  }

  async genres() {
    let genres = await this.parser.get(this.parser.types.ARRAY, {
      Input: 'What genres are on this album?'
    });
    return '| genre = ' + genres.map(function(genre) {
      return `{{Genre|${genre}}}`;
    }).join(', ') + '\n';
  }

  async artists(type) {
    let artists = await this.parser.get(this.parser.types.ARRAY, {
      Input: 'Which artists served the role of ' + type + '?'
    });
    return `| ${type} = ` +
      artists.map(function(artist) {
        return `${artist}\n`
      }).join(': ');
  }

  async otherArtists() {
    let data = await this.parser.get(this.parser.types.OBJECT, {
      Input: async () => {
        let getArtists = true;
        let otherArtists = {};
        while (getArtists) {
          if (await this.parser.get(this.parser.types.BOOLEAN, {
            Input: 'Are there other roles that artists fill?'
          })) {
            let role = await this.parser.get(this.parser.types.STRING, {
              Input: 'Which other role did artists fill?'
            });
            let artists = await this.parser.get(this.parser.types.ARRAY, {
              Input: 'Which artists filled that role?'
            });
            otherArtists[role] = artists;
          } else {
            getArtists = false;
          }
        }
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

  async autogendesc() {
    return await this.parser.get(this.parser.types.STRING, {
      Input: {
        message: 'What arrangements exist on this album?',
        choices: ['vocal', 'instrumental', 'vocal and instrumental', '?']
      }
    });
  }

  async tracks() {
    let tracks = '';
    let number = parseInt(await this.parser.get(this.parser.types.STRING, {
      Input: 'How many tracks are on this album?'
    }));
    for (let i = 1; i <= number; i++) {
      let title = await this.parser.get(this.parser.types.STRING, {
        Input: 'What is the title of the track?'
      });
      let titleen;
      if (title.match(Util.japanese)) {
        titleen = await this.parser.get(this.parser.types.STRING, {
          Input: 'What is the translated title of the track?' || '___'
        });
      }
      let length = await this.parser.get(this.parser.types.STRING, {
        Input: 'What is the length of the track?'
      });
      let lyricPage = await this.parser.get(this.parser.types.BOOLEAN, {
        Input: 'Does this track have lyrics?'
      });
      let arrangement = await this.parser.get(this.parser.types.STRING, {
        Input: 'Which artists arranged this track?'
      });
      let lyrics = await this.parser.get(this.parser.types.STRING, {
        Input: 'Which artists wrote lyrics for this track?'
      });
      let vocals = await this.parser.get(this.parser.types.STRING, {
        Input: 'Which vocalists sang on this track?'
      });
      let otherArtistObj = await this.parser.get(this.parser.types.OBJECT, {
        Input: async () => {
          let checkOthers = true;
          let otherArtists = {};
          while (checkOthers) {
            if (await this.parser.get(this.parser.types.BOOLEAN, {
              Input: 'Are there other roles that artists fill?'
            })) {
              let role = await this.parser.get(this.parser.types.STRING, {
                Input: 'Which other role did artists fill?'
              });
              let artists = await this.parser.get(this.parser.types.STRING, {
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
      let workObj = await this.parser.get(this.parser.types.OBJECT, {
        Input: async () => {
          let getWorks = true;
          let works = {};
          while (getWorks) {
            if (await this.parser.get(this.parser.types.BOOLEAN, {
              Input: 'Are there additional works this track is based off of?'
            })) {
              let getTracks = true;
              let tracks = [];
              while (getTracks) {
                if (await this.parser.get(this.parser.types.BOOLEAN, {
                  Input: 'Are there more tracks from the same work serving as the basis for this track?'
                })) {
                  tracks.push(await this.parser.get(this.parser.types.STRING, {
                    Input: 'What is the title of the original track?'}
                  ));
                } else {
                  getTracks = false;
                }
              }
              works[await this.parser.get(this.parser.types.STRING, {
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

  async parse() {
    return `{{MusicArticle\n` +
      await this.musictype() +
      await this.title() +
      await this.group() +
      `| released    =${await this.parser.get(this.parser.types.STRING, {
        Input: 'When was this album released?'
      })}\n` +
      `| convention  =${await this.parser.get(this.parser.types.STRING, {
        Input: 'Which convention was this album released at?'
      })}\n` +
      `| tracks      =${await this.parser.get(this.parser.types.STRING, {
        Input: 'How many tracks are on the album?'
      })}\n` +
      `| length      =${await this.parser.get(this.parser.types.STRING, {
        Input: 'What is the running length of the album?'
      })}\n` +
      `| catalogno   =${await this.parser.get(this.parser.types.STRING, {
        Input: 'What is the catalog number of the album?'
      })}\n` +
      await this.genres() +
      `| website     =${await this.parser.get(this.parser.types.STRING, {
        Input: "What is the URL to the album's discography entry?"
      })}\n` +
      `| image       =${await this.parser.get(this.parser.types.STRING, {
        Input: 'What is the filename of the cover art?'
      })}\n` +
      `| caption     =${await this.parser.get(this.parser.types.STRING, {
        Input: 'Would you like to add an optional caption for the cover art?'
      })}\n` +
      `| banner      =${await this.parser.get(this.parser.types.STRING, {
        Input: 'What is the filename of the article banner?',
      })}\n` +
      `| banner_res  =${await this.parser.get(this.parser.types.STRING, {
        Input: 'Would you optionally like to set the resolution of the banner?'
      })}\n` +
      // `| multicolumn =Set to allow for multiple staff credits columns\n` +
      await this.artists('arranger') +
      await this.artists('lyricist') +
      await this.artists('vocalist') +
      await this.artists('producer') +
      await this.artists('illustrator') +
      await this.artists('designer') +
      await this.artists('masterer') +
      await this.otherArtists() +
      // `| no_intro    =Set this value to remove the first template generated sentence\n` +
      // `| non_album   =Set for non-albums\n` +
      `| autogendesc =${await this.autogendesc()}\n` +
      // `| description =Information to put after the introduction before the Staff section\n` +
      `| tracklist   =\n${await this.tracks()}\n` +
      `| notes       =\n` +
      `| review      =\n` +
      `| print_references =\n` +
      `}}\n`;
  }
}

module.exports = MusicArticle;
