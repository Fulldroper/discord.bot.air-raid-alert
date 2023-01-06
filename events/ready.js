const r = require("axios")
module.exports = async function () {
  this.db.connect()
  let users_counter = 0
  const interval = 20000
  
  await this.guilds.cache.forEach(async s => users_counter += s.memberCount )
  
  this.users_counter = users_counter

  console.log('[start] as ', this.user.tag, " at ", new Date);
  console.log(`[Addons](${Object.keys(this.addons).length}):`, Object.keys(this.addons))
  console.log(`[Commands](${Object.keys(this.cmds).length}):`, Object.keys(this.cmds));
  console.log(`[Servers](${this.guilds.cache.size})`);
  console.log(`[Users](${users_counter})`);

  while (true) {
    console.log(`[checking updates by API]`);
    let { latest, alerts: older} = await this.db.get(`${this.user.username}:buffer`) || { latest: false, alerts: []}
    const req = {
      method: 'get',
      url: 'https://api.alerts.in.ua/v1/alerts/active.json',
      maxRedirects: 0,
      headers: {
        "Connection": "closed"
      }
    }
    latest && (req.headers["If-Modified-Since"] = latest)
    const { status, data, headers } = await r(req).catch(() => console.log(`[updates not found]`)) || {status: false, data: false, headers: false}
    let { alerts: newer } = data
    if (status === 200) {
      console.log(`[updates found]`);
      
      for (let n = 0; n < newer.length; n++) {
        let o = older.findIndex(old_region => old_region.location_oblast !== newer[n].location_oblast)

        if(o > 0){
          newer.splice(1, n)
          older.splice(1, o)
        }
        
        console.log({newer, older});
      }      
      // send to start
      for (const region of newer) {
        if(region["location_type"] === "oblast") {
          const subscribers = await this.db.get(`${this.user.username}:${region.location_oblast}`) || []
          for (const uid of subscribers) {
            const user = await this.users.fetch(uid) || false
            if (user) {
              if (user.bot) return
              user.send(`🚨 ${region.location_title} повітряна тривога`)
              .catch(() => console.log(`${user.tag} not sended`))        
            }
          }
        }
      }
      // send to end
      for (const region of older) {
        if(region["location_type"] === "oblast") {
          const subscribers = await this.db.get(`${this.user.username}:${region.location_oblast}`) || []
          for (const uid of subscribers) {
            const user = await this.users.fetch(uid) || false
            if (user) {
              if (user.bot) return
              user.send(`🕊️ ${region.location_title} відбій повітряної тривоги`)
              .catch(() => console.log(`${user.tag} not sended`))        
            }
          }
        }
      }
      
      await this.db.set(`${this.user.username}:buffer`, { latest: headers["last-modified"], alerts: newer})
    }
    await interval.sleep()
  }
}