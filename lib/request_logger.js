const requestLogger = function (req, res, next) {
  console.log('\n===== Incoming Request =====\n')
  console.log(`${new Date()}`)
  console.log(`${req.method} ${req.url}`)
  console.log(`body ${JSON.stringify(req.body)}`)
  console.log('\n============================\n')
  console.log(req.headers)
  next()
}

module.exports = requestLogger
