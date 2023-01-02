module.exports = async function (interaction) {
  const types = ["ping", "run", "component", "autocomplete", "modal"]

  try {
    if (interaction.customId) interaction.meta = interaction.customId.split(":");
    const type = (["ping", "run", "component", "autocomplete", "modal"])[interaction.type - 1]
    const index = interaction.commandName || interaction.meta[0] 

    if (
      this.cmds[ index ] &&
      this.cmds[ index ][ type ]
      ) {
          
      await this.cmds[ index ][ type ].call(this, interaction)

    } else interaction.reply({ 
      content: 'Команда не існує', 
      ephemeral: true 
    }).catch(e => console.log("Команда не існує",e));

  } catch (error) {
    console.log(error);
  }
}