module.exports = async function () {
  
  const x = async buffer =>{
    try {
      console.log(
        await eval(
          buffer.toString().trim()
        )
      );
    } catch (error) {
      console.error(error)
    }
  }

  const exec_node = x.bind(this)

  process.stdin.on("data", exec_node)
}