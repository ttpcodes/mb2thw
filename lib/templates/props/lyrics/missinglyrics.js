module.exports = async function (type, parser) {
  let boolean = await parser.get(parser.types.BOOLEAN, {
    Input: 'Is this track un' + type + '?'
  })
  return boolean
  // return boolean ? `| un${type} = Y\n` : ''
}
