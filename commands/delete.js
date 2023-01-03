module.exports.info = {
  "name": "delete",
  "type": 1,
  "description": "Відписатися від сповіщення про тривогу",
  "dm_permission": false,
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
  if (!subscribers.includes(interaction.author.id)) {

    await this.db.setArray(`${this.user.username}:${value}`, subscribers.filter(id => id !== interaction.author.id))
    
    interaction.reply({content: `✅ Ви успішно відписались на **${value}**`, ephemeral: true})
  } else interaction.reply({content: `✅ Ви не підписані на **${value}**`, ephemeral: true});
}

module.exports.autocomplete = async function(interaction) {
  let input = interaction.options.getFocused(true).value
  if (!input) return;
  const choices = [
    "Луганська область",
    "Харківська область",
    "Донецька область",
    "Запорізька область",
    "Миколаївська область",
    "Чернігівська область",
    "Дніпропетровська область",
    "м. Київ",
    "Житомирська область",
    "Полтавська область",
    "Черкаська область",
    "Сумська область",
    "Кіровоградська область",
    "Київська область",
    "Вінницька область",
    "Одеська область",
    "Волинська область",
    "Хмельницька область",
    "Тернопільська область",
    "Рівненська область",
    "Івано-Франківська область",
    "Львівська область",
    "Чернівецька область",
    "Закарпатська область",
    "Херсонська область",
    "Автономна Республіка Крим",
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