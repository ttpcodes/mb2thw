module.exports = async function (type, parser) {
  let stanzasObj = await parser.get(parser.types.OBJECT, {
    Input: async () => {
      let getStanzas = true
      let stanzas = []
      while (getStanzas) {
        if (await parser.get(parser.types.BOOLEAN, {
          Input: 'Are there additional stanzas for ' + type + '?'
        })) {
          stanzas.push(await parser.get(parser.types.STRING, {
            Input: {
              message: 'What lyrics are contained in this stanza?',
              text: true
            }
          }))
        } else {
          getStanzas = false
        }
      }
      return stanzas
    }
  })
  return stanzasObj.map(function (stanza, index) {
    return `| ${type}${ index + 1 } =\n${stanza}\n`
  }).join('')
}
