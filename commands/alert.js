module.exports.info = {
  "name": "alert",
  "type": 1,
  "description": "Підписатися на сповіщення про тривоги",
  "options":[
    {
      "type": 3,
      "name": "region",
      "description": "Вкажіть область",
      "required": true,
      "autocomplete": true,
      
    }
  ]
}

module.exports.run = async function (interaction) {
  const { value } = interaction.options.get("region")
  const subscribers = await this.db.get(`${this.user.username}:${value}`) || []
  const id = interaction.author?.id || interaction.user?.id || interaction.member?.id
  if (!subscribers.includes(id)) {
    subscribers.push(id)
    await this.db.setArray(`${this.user.username}:${value}`, subscribers)
    
    interaction.reply({content: `✅ Ви успішно підписались на **${value}**`, ephemeral: true})
  } else interaction.reply({content: `✅ Ви вже підписані на **${value}**`, ephemeral: true});
}

module.exports.autocomplete = async function(interaction) {
  let input = interaction.options.getFocused(true).value
  if (!input) return;
  const choices = [
    "Вінницька область",
    "Волинська область",
    "Дніпропетровська область",
    "Донецька область",
    "Житомирська область",
    "Закарпатська область",
    "Запорізька область",
    "Івано-Франківська область",
    "Київська область",
    "Кіровоградська область",
    "Луганська область",
    "Львівська область",
    "Миколаївська область",
    "Одеська область",
    "Полтавська область",
    "Рівненська область",
    "Сумська область",
    "Тернопільська область",
    "Харківська область",
    "Херсонська область",
    "Хмельницька область",
    "Черкаська область",
    "Чернівецька область",
    "Чернігівська область",
    "м. Київ"
  ]
  const customFilter = str => {
    str = str.toLowerCase()
    input = input.toLowerCase()

    return str.startsWith(input)
  }
  let filtered = choices.filter(customFilter).map(el => ({name: el, value: el}))
  if(!filtered) return;
  if(filtered.length > 20) filtered = filtered.slice(0,20)
  interaction.respond(filtered)
}
