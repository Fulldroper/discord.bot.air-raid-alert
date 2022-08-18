module.exports = async function (interaction) {
  switch (interaction.type) {    
    case 2: // ApplicationCommand
    case 4: // ApplicationCommandAutocomplete
      if (this.cmds[interaction.commandName]) {
        await this.cmds[interaction.commandName][
          interaction.type === 2 ? "exec" : "autocomplete"
        ].call(this, interaction)
      } else interaction.reply({ 
        content: 'Команда не існує', 
        ephemeral: true 
      }).catch(e => console.log("Команда не існує",e));
    break;
    
    case 3:
      // MessageComponent
    break;

    case 5:
      // ModalSubmit
    break;   
  
    default: // another 
      console.log(interaction);
    break;
  }
}