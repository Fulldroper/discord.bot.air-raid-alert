module.exports = class {
  constructor(url) {
    this.obj = require('redis').createClient({url})
    this.isConnected = false
    
    // this.obj.on("reconnecting", () => console.log('[redis]: reconnecting'))
    // this.obj.on("connect", () => console.log('[redis]: connected'))
    // this.obj.on("ready", () => console.log('[redis]: ready'))
    // this.obj.on("end", () => console.log('[redis]: connection closed'))
    this.obj.on("error", e => 0)
  }
  async get(key) {
    return JSON.parse(await this.obj.get(key))
  }
  set(key, value) {
    this.obj.set(key, JSON.stringify(value))
  }
  connect() {
    if (this.isConnected) return;
    this.obj.connect()
    this.isConnected = true
  }
}