module.exports.info = {
  name: 'ping',
  type: 1,
  description: 'Replies with Pong!',
  options: [
    {
      type: 3,
      name: "name",
      description: "your name",
      autocomplete: true
    }
  ]
}

module.exports.exec = async function(interaction) {
  interaction.reply({content: "ok", ephernal: true})
}

module.exports.autocomplete = async function(interaction) {
  interaction.respond([
    {
      name: 'Option 1',
      value: 'option1',
    },
  ])
}