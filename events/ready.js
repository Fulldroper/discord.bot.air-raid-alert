module.exports = async function () {
  this.db.connect()
  
  console.log('[start] as ', this.user.tag, " at ", new Date);
  console.log(`[Addons](${Object.keys(this.addons).length}):`, Object.keys(this.addons))
  console.log(`[Commands](${Object.keys(this.cmds).length}):`, Object.keys(this.cmds));
  
  // this.addons["io-i"]()
  // const http = require('node:http')
  const axios = require("axios").default
  let last_modified
  let buff_alerts
  const loop = (async function () {
    const check = async function ({alerts}) {
      const now_alerts = {}
      let start, end

      alerts.forEach(el => {
        now_alerts[el.location_title] = ({title: el.location_title, started_at: el.started_at})
      })      

      if (!buff_alerts) {
        buff_alerts = start = now_alerts
      } else {
        const old_arr = Object.keys(buff_alerts)
        const now_arr = Object.keys(now_alerts)

        start = now_arr.filter(x => (!old_arr.includes(x)))
        end = old_arr.filter(x => (!now_arr.includes(x)))
      }

      if (start) {
        for (let i = 0; i < start.length; i++) {
          const list = (await this.db.get(`alert.bot.${start[i]}`))?.split(",") || []
          if (list) {
            for (let j = 0; j < list.length; j++) {
              const user = await this.users.fetch(list[j])
              user.send({
                content: `🚨 Повітряна тривога в ${start[i]}`
              })
              .catch(() => console.log(`Сповіщення не відправленно ${users.tag}`))
              await (300).sleep();
            }
          }
        }
      }

      if (end) {
        for (let i = 0; i < end.length; i++) {
          const list = (await this.db.get(`alert.bot.${end[i]}`))?.split(",") || []
          if (list) {
            for (let j = 0; j < list.length; j++) {
              const user = await this.users.fetch(list[j])
              user.send({
                content: `🕊️ Відміна тривоги в ${end[i]}`
              })
              .catch(() => console.log(`Сповіщення не відправленно ${users.tag}`))
              await (300).sleep();
            }
          }
        }
      }
    };

    if (last_modified) {
      const head = await axios({
        method: 'get',
        url: `https://api.alerts.in.ua/v1/alerts/active.json`,
        // headers: { "Authorization": `Bot ${ process.env.TOKEN }` }
      }).catch(e => console.log(e))

      if (head.status = 304) {
        last_modified = head.headers['last-modified']
      } else {
        check(head.data)
        last_modified = head.headers['last-modified']
      }

    } else {
      const get = await axios({
        method: 'get',
        url: `https://api.alerts.in.ua/v1/alerts/active.json`,
        // headers: { "Authorization": `Bot ${ process.env.TOKEN }` }
      }).catch(e => console.log(e))
      check(get.data)
      last_modified = get.headers['last-modified']
    }

    await (1000).sleep()
  }).bind(this)

  this.addons['readyLoop'](loop, 3000)
}