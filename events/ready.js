module.exports = async function () {
  this.db.connect()
  
  console.log('[start] as ', this.user.tag, " at ", new Date);
  console.log(`[Addons](${Object.keys(this.addons).length}):`, Object.keys(this.addons))
  console.log(`[Commands](${Object.keys(this.cmds).length}):`, Object.keys(this.cmds));
  
  // this.addons["io-i"]()
  
  const loop = async function () {
    // console.log(1);
  }

  this.addons['readyLoop'](loop, 3000)
}