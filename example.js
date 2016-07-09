
// Maybe not the best example since you could just use
// co()'s `yield [...]' here, or Promise.all(), but it
// illustrates the usage.

const WaitGroup = require('./index')
const sleep = require('co-sleep')
const axios = require('axios')
const co = require('co')

const urls = [
  'http://yahoo.com',
  'http://youtube.com',
  'http://facebook.com',
  'http://segment.com',
  'http://cloudup.com'
]

const wg = new WaitGroup

for (let url of urls) {
  wg.add()
  co(function *(){
    console.log('GET %s', url)
    const res = yield axios.get(url)
    console.log('GET %s -> %s', url, res.status)
    wg.done()
  }).catch(console.error)
}

co(function*(){
  console.log('waiting')
  yield wg.wait()
  console.log('done waiting')
}).catch(console.error)

co(function*(){
  console.log('waiting')
  yield wg.wait()
  console.log('done waiting')
}).catch(console.error)
