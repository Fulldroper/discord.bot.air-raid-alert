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

module.exports.exec = async function (interaction) {
  const { value } = interaction.options.get("region")
  const arr = (await this.db.get(`alert.bot.${value}`)) || []
  if (!arr.includes(interaction.member?.id)) {
    arr.push(interaction.member.id)
    this.db.set(`alert.bot.${value}`, arr)
    interaction.member.send(`✅ Ви успішно підписались на **${value}**`)
    .then(() => interaction.reply({content: `✅ Ви успішно підписались на **${value}**` ,ephemeral: true}))
    .catch(() => interaction.reply({ content: `❌ Помилка, ви повинні дозволити писати вам приватні повідомлення і спробуйте знову`, ephemeral: true }));
  } else interaction.reply({ content: `❌ Ви вже підписані на **${value}**`, ephemeral: true }).catch(e => console.log(e));
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





