const WebSocket = require('ws')

let ws = new WebSocket('http://localhost:4141/_sock/')

function send(zome, fn, arg) {
  ws.send(JSON.stringify({
    zome,
    fn,
    arg: JSON.stringify(arg)
  }))
}

ws.on('open', () => {
  console.log('connection open')
})

ws.on('message', function(data) {
  data = JSON.parse(data)
  if (Array.isArray(data)) {
    if (messages.length < data.length) {
      data.filter(function(e){
        return !messages.find(function(m){
          return m.Hash === e.Hash
        })
      }).forEach(function(e) {
        console.log(e.Entry)
      })
      messages = data
    }
  } else {
    console.log(data)
  }
})

let messages = []
function getAll() {
  send('wsTest', 'getAll', '')
}
setInterval(getAll, 1000)

module.exports = {
  commit: function (type, content) {
    send('wsTest', 'commitWrapped', {type, content})
  },
  remove: function (hash, message = '') {
    send('wsTest', 'removeWrapped', {hash, message})
  },
  sign: function (content) {
    send('wsTest', 'signWrapped', content)
  },
  get: function (hash) {
    send('wsTest', 'getWrapped', hash)
  }
}