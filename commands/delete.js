module.exports.info = {
  "name": "delete",
  "type": 1,
  "description": "Відписатися від сповіщення про тривогу",
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
  const hasUser = await this.db.pipe.findOne({ id: interaction.member.id })
  if (hasUser) {
    await this.db.pipe.updateOne(
      { id: interaction.member?.id },
      { $set: {alerts: hasUser.alerts.filter(el => el !== value)} }
    )
  }

  interaction.member.send(`✅ Ви успішно відписались від **${value}**`)
  .then(() => interaction.reply({content: `✅ Ви успішно відписались на **${value}**` ,ephemeral: true}))
  .catch(() => {
    interaction.reply({ content: `❌ Помилка, ви повинні дозволити писати вам приватні повідомлення і спробуйте знову`, ephemeral: true })
    .catch(() => console.log(interaction.member.id, "відповідь не була відправлена"))
  });
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





