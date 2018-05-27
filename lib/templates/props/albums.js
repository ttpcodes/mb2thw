module.exports = async function (parser) {
  let albumsObj = await parser.get(parser.types.OBJECT, {
    Input: async () => {
      let getAlbums = true
      let albums = []
      while (getAlbums) {
        if (await parser.get(parser.types.BOOLEAN, {
          Input: 'Are there additional albums this track appears on?'
        })) {
          let album = {}
          album.name = await parser.get(parser.types.STRING, {
            Input: 'What is the name of the album?'
          })
          album.image = await parser.get(parser.types.STRING, {
            Input: 'What is the filename of the cover art?'
          })
          albums.push(album)
        } else {
          getAlbums = false
        }
      }
      return albums
    }
  })
  return albumsObj.map(function (album, index) {
    return `| album${ index + 1 } = {{LyricAlbum|${album.name}|${album.image}}}\n`
  }).join('')
}
