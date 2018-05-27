module.exports = async function(parser) {
  let length = await parser.get(parser.types.STRING, {
    Input: 'What is the length of the track?'
  });
  return `| length = ${length}\n`
}
