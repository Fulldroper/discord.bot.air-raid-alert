module.exports = async (fn, interval = 1000) => {
  if(!fn) return
  console.log(`[readyLoop] started with interval ${interval}ms`);
  while (true) {
    await fn()
    await interval.sleep() 
  }  
}