const r = require("axios")
module.exports = async function () {
  this.db.connect()
  let users_counter = 0
  const interval = 13000

  const req = {
    method: 'get',
    url: 'http://alerts.com.ua/api/states',
    maxRedirects: 0,
    headers: {
      "X-API-Key": process.env.API_KEY
    }
  }

  const Time = x => new Date(`${x}`).getTime()
  
  await this.guilds.cache.forEach(async s => users_counter += s.memberCount )
  
  this.users_counter = users_counter

  console.log('[start] as ', this.user.tag, " at ", new Date);
  console.log(`[Addons](${Object.keys(this.addons).length}):`, Object.keys(this.addons))
  console.log(`[Commands](${Object.keys(this.cmds).length}):`, Object.keys(this.cmds));
  console.log(`[Servers](${this.guilds.cache.size})`);
  console.log(`[Users](${users_counter})`);

  while (true) {
    console.log(`checking updates by API`);
    // get from db
    const { states = [], last_update = false } = (await this.db.get(`${this.user.username}:buffer`)) || {}
    const { data } = await r(req).catch(() => console.log(`rate limit`)) || { data: { states: [], last_update: false }}
    // check update time
    if(Time(data.last_update) > Time(last_update)){
      // format old
      const old = {}
      states.forEach(e => old[e.name] = {alert: e.alert, changed: Time(e.changed)})
      // format now
      const now = {}
      data.states.forEach(e => now[e.name] = {alert: e.alert, changed: Time(e.changed)})
      // find all new
      for (const key in now) {
        // check if state changed
        if (now[key].changed > old[key].changed) {
          // get subscribers list
          const subscribers = await this.db.get(`${this.user.username}:${key}`) || []
          // send to subscribers status
          for (const subscriber of subscribers) {
            const user = await this.users.fetch(subscriber) || false
            // check if user founded and not bot
            if (user && !user.bot) {
              // send state to user              
              user.send(`${
                now[key].alert ? '🚨' : '🕊️'
              } ${key} ${
                now[key].alert ? 'повітряна тривога' : 'відбій повітряної тривоги'
              }`)
              .catch(() => console.log(`${user.tag} not sended`)) 
            }
          }
        } else console.log(`${key} not changed`);        
      }
      // save new date
      await this.db.set(`${this.user.username}:buffer`, data)
    } else if(last_update === false) {
      console.log('init update');
      await this.db.set(`${this.user.username}:buffer`, data)
    } else console.log(`updates not found`);
    // wait gateway interval    
    await interval.sleep()
  }
}