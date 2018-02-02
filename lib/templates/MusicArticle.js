const {
  artists, autogendesc, genres, group, musictype, otherArtists, title, tracks
} = require('./props');

class MusicArticle {
  constructor(parser) {
    this.parser = parser;
  }

  async parse() {
    return `{{MusicArticle\n` +
      await musictype(this.parser) +
      await title(this.parser) +
      await group(this.parser) +
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
      await genres(this.parser) +
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
      await artists('arranger', this.parser) +
      await artists('lyricist', this.parser) +
      await artists('vocalist', this.parser) +
      await artists('producer', this.parser) +
      await artists('illustrator', this.parser) +
      await artists('designer', this.parser) +
      await artists('masterer', this.parser) +
      await otherArtists(this.parser) +
      // `| no_intro    =Set this value to remove the first template generated sentence\n` +
      // `| non_album   =Set for non-albums\n` +
      `| autogendesc =${await autogendesc(this.parser)}\n` +
      // `| description =Information to put after the introduction before the Staff section\n` +
      `| tracklist   =\n${await tracks(this.parser)}\n` +
      `| notes       =\n` +
      `| review      =\n` +
      `| print_references =\n` +
      `}}\n`;
  }
}

module.exports = MusicArticle;
