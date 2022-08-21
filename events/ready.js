module.exports = async function () {
  await this.db.connect()
  
  console.log('[start] as ', this.user.tag, " at ", new Date);
  console.log(`[Addons](${Object.keys(this.addons).length}):`, Object.keys(this.addons))
  console.log(`[Commands](${Object.keys(this.cmds).length}):`, Object.keys(this.cmds));
  
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
        for (const key in start) {
          let list = await this.db.pipe.find({
            alerts: start[key].title
          })
          list = await list.toArray()
          if (list?.length) {
            for (const el of list) {
              const user = await this.users.fetch(el.id)
              user.send({
                content: `🚨 Повітряна тривога в ${key}`
              })
              .catch(() => console.log(`Сповіщення не відправленно ${users.tag}`))
            } 
          }
        }
      }

      if (end) {
        for (const key in end) {
          let list = await this.db.pipe.find({
            alerts: [end[key].title] 
          })
          list = await list.toArray()
          if (list?.length) {
            for (const el of list) {
              const user = await this.users.fetch(el.id)
              user.send({
                content: `🕊️ Відміна тривоги в ${key}`
              })
              .catch(() => console.log(`Сповіщення не відправленно ${users.tag}`))
            } 
          }
        }
      }
    }.bind(this);

    if (last_modified) {
      const head = await axios({
        method: 'get',
        url: `https://api.alerts.in.ua/v1/alerts/active.json`,
        // headers: { "Authorization": `Bot ${ process.env.TOKEN }` }
      }).catch(e => console.log(e))

      if (head.status === 304 && buff_alerts) {
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

  }).bind(this)

  this.addons['readyLoop'](loop, 3000)
}