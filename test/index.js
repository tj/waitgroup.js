
const WaitGroup = require('..')
const sleep = require('co-sleep')
const co = require('co')

describe('WaitGroup()', function() {
  it('should default counter to zero', function() {
    const wg = new WaitGroup
    wg.n.should.equal(0)
  })
})

describe('WaitGroup(n)', function() {
  it('should set counter to n', function() {
    const wg = new WaitGroup(5)
    wg.n.should.equal(5)
  })
})

describe('.add()', function() {
  it('should incremenet by one', function() {
    const wg = new WaitGroup
    wg.add()
    wg.add()
    wg.n.should.equal(2)
  })
})

describe('.add(n)', function() {
  it('should incremenet by n', function() {
    const wg = new WaitGroup
    wg.add(5)
    wg.n.should.equal(5)

    wg.add(5)
    wg.n.should.equal(10)
  })
})

describe('.done()', function() {
  it('should decrement by one', function() {
    const wg = new WaitGroup(5)
    wg.done()
    wg.n.should.equal(4)
  })

  it('should error when negative', function(cb) {
    const wg = new WaitGroup

    try {
      wg.done()
    } catch (e) {
      e.message.should.equal('negative WaitGroup counter')
      cb()
    }
  })
})

describe('.wait()', function() {
  it('should return a promise which resolves when counter == 0', function() {
    const wg = new WaitGroup(3)
    let n = 0

    co(function *(){
      n = 1
      yield sleep(10)
      wg.done()

      n = 2
      yield sleep(10)
      wg.done()

      n = 3
      yield sleep(10)
      wg.done()
    })

    return co(function *(){
      yield wg.wait()
      n.should.equal(3)
    })
  })

  it('should resolve immediately when counter == 0', function() {
    const wg = new WaitGroup

    return co(function *(){
      yield wg.wait()
    })
  })

  it('should support subsequent waits', function() {
    const a = new WaitGroup(2)
    const b = new WaitGroup(1)
    let n = 0

    co(function *(){
      n = 1
      yield sleep(10)
      a.done()

      n = 2
      yield sleep(10)
      a.done()

      yield b.wait()

      n = 3
      yield sleep(10)
      a.done()

      n = 4
      yield sleep(10)
      a.done()
    })

    return co(function *(){
      yield a.wait() // after 2
      n.should.equal(2)

      yield a.wait() // zero

      a.add(2)
      b.done() // signal continuation

      yield a.wait()
      n.should.equal(4) // after another 2

      yield a.wait() // zero
      yield b.wait() // zero
    })
  })
})
