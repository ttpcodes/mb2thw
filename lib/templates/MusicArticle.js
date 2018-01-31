const Input = require('../Input');
const Util = require('../Util');

class MusicArticle {
  static async musictype() {
    switch(await Input.get({
      type: 'list',
      message: 'What type of album is this?',
      choices: ['Official CDs', 'Original CDs', 'Other']
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
    let title = await Input.getString('What is the title of the album?');
    // https://stackoverflow.com/questions/43418812/check-whether-a-string-contains-japanese-chinese-characters
    if (title.match(Util.japanese)) {
      let titlejprom = await Input.getString('What is the romanized title of the album?');
      let titleen = await Input.getString('What is the translated title of the album?');
      return `| titlejp = ${title}\n` +
        `| titlejprom = ${titlejprom}\n` +
        `| titleen = ${titleen}\n`;
    } else {
      return `| titleen = ${title}\n`;
    }
  }

  static async group() {
    let group = await Input.getString('What is the name of the group?');
    if (group.match(Util.japanese)) {
      let groupCat = await Input.getString('What is the romanized name of the group?');
      return `| group = [[${group}|${groupCat}]]\n` +
        `| groupCat = ${groupCat}\n`;
    } else {
      return `| group = ${group}\n`
    }
  }

  static async genres() {
    let genres = await Input.getString('What genres are on this album?');
    return '| genre = ' + genres.split(',').map(function(genre) {
      return `{{Genre|${genre}}}`;
    }).join(', ') + '\n';
  }

  static async artists(type) {
    let artists = await Input.getString('Which artists served the role of ' + type + '?');
    return `| ${type} = ` +
      artists.split(',').map(function(artist) {
        return `${artist}\n`
      }).join(': ');
  }

  static async otherArtists(recur) {
    let otherArtists = ''
    if (await Input.getBoolean('Are there other roles that artists fill?')) {
      let role = await Input.getString('Which other role did artists fill?');
      let artists = await Input.getString('Which artists filled that role?');
      otherArtists += (recur ? '' : `| other_staff =\n`) +
        `; ${role}\n` +
        artists.split(',').map(function(artist) {
          return `: ${artist}\n`;
        }).join('') + await MusicArticle.otherArtists(true);
    }
    return otherArtists;
  }

  static async autogendesc() {
    return await Input.get({
      type: 'list',
      message: 'What arrangements exist on this album?',
      choices: ['vocal', 'instrumental', 'vocal and instrumental', '?']
    });
  }

  static async tracks() {
    let tracks = '';
    let number = parseInt(await Input.getString('How many tracks are on this album?'));
    for (let i = 1; i <= number; i++) {
      let title = await Input.getString('What is the title of the track?');
      let titleen;
      if (title.match(Util.japanese)) {
        titleen = await Input.getString('What is the translated title of the track?') || '___';
      }
      let length = await Input.getString('What is the length of the track?');
      let lyricPage = await Input.getBoolean('Does this track have lyrics?');
      let arrangement = await Input.getString('Which artists arranged this track?');
      let lyrics = await Input.getString('Which artists wrote lyrics for this track?');
      let vocals = await Input.getString('Which vocalists sang on this track?');
      let checkOthers = true;
      let otherArtists = '';
      while (checkOthers) {
        if (await Input.getBoolean('Are there other roles that artists fill?')) {
          let role = await Input.getString('Which other role did artists fill?');
          let artists = await Input.getString('Which artists filled that role?');
          otherArtists += `** ${role}: ${artists}\n`;
        } else {
          checkOthers = false;
        }
      }
      let getWorks = true;
      let works = '';
      while (getWorks) {
        if (await Input.getBoolean('Are there additional works this track is based off of?')) {
          let getTracks = true;
          while (getTracks) {
            if (await Input.getBoolean('Are there more tracks from the same work serving as the basis for this track?')) {
              works += `** original title: ${await Input.getString('What is the title of the original track?')}\n`
            } else {
              getTracks = false;
            }
          }
          works += `** source: ${await Input.getString('Which work did the preceding tracks come from?')}\n`;
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
      `| released    =${await Input.getString('When was this album released?')}\n` +
      `| convention  =${await Input.getString('Which convention was this album released at?')}\n` +
      `| tracks      =${await Input.getString('How many tracks are on the album?')}\n` +
      `| length      =${await Input.getString('What is the running length of the album?')}\n` +
      `| catalogno   =${await Input.getString('What is the catalog number of the album?')}\n` +
      await MusicArticle.genres() +
      `| website     =${await Input.getString("What is the URL to the album's discography entry?")}\n` +
      `| image       =${await Input.getString('What is the filename of the cover art?')}\n` +
      `| caption     =${await Input.getString('Would you like to add an optional caption for the cover art?')}\n` +
      `| banner      =${await Input.getString('What is the filename of the article banner?')}\n` +
      `| banner_res  =${await Input.getString('Would you optionally like to set the resolution of the banner?')}\n` +
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
