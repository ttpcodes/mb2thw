const { albums, artists, group, length, title, otherArtists, source } = require('./props')

const { missingLyrics, stanzas } = require('./props/lyrics')

class Lyrics {
  constructor (parser) {
    this.parser = parser
  }

  async parse () {
    let engonly = await this.parser.get(this.parser.types.BOOLEAN, {
      Input: 'Is this song originally in English?'
    })
    let untranscribed = await missingLyrics('transcribed', this.parser)
    let unromanized = await missingLyrics('romanized', this.parser)
    let untranslated = await missingLyrics('translated', this.parser)
    return '{{Lyrics\n' +
      await group(this.parser, true) +
      await title(this.parser, true) +
      await length(this.parser) +
      await artists('arranger', this.parser) +
      await artists('lyricist', this.parser) +
      await artists('vocalist', this.parser) +
      await otherArtists(this.parser) +
      `| source =\n` +
      await source(this.parser) +
      (engonly ? `| engonly = Y\n` : '') +
      (untranscribed ? `| untranscribed = Y\n` : '') +
      (unromanized ? `| unromanized = Y\n` : '') +
      (untranslated ? `| untranslated = Y\n` : '') +
      await albums(this.parser) +
      (engonly ? '' : '| lang = ja\n') +
      (untranscribed ? '' : await stanzas('kan', this.parser)) +
      (unromanized ? '' : await stanzas('rom', this.parser)) +
      (untranslated ? '' : await stanzas('eng', this.parser)) +
      `| lyrics_source = ${ await this.parser.get(this.parser.types.STRING, {
        Input: 'Is there any information regarding the source of the lyrics?'
      })}\n` +
      `| notes = ${ await this.parser.get(this.parser.types.STRING, {
        Input: 'Are there any notes about these lyrics?'
      }) }\n` +
      `| extra_info = ${ await this.parser.get(this.parser.types.STRING, {
        Input: 'Is there any additional info about these lyrics?'
      }) }\n` +
      '}}'
  }
}

module.exports = Lyrics
