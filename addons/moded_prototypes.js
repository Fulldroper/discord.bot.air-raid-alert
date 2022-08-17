module.exports = () => {
  Number.prototype.sleep = function (params) {
    const time = this
    return new Promise(res => {
        setInterval(res, time)
    }) 
  }
}