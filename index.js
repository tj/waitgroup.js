
module.exports = class WaitGroup {

  /**
   * Initialize WaitGroup with a starting counter defaulting to 0.
   */

  constructor(n = 0) {
    this.cbs = []
    this.n = n
  }

  /**
   * Add `delta` to the counter, defaulting to 1.
   */

  add(delta = 1) {
    this.n += delta
    if (this.n < 0) throw new Error('negative WaitGroup counter')
    this._check()
  }

  /**
   * Decrement the counter by one.
   */

  done() {
    this.add(-1)
  }

  /**
   * Wait returns a promise which is resolved when the counter reaches zero.
   */

  wait() {
    return new Promise((resolve, reject) => {
      this.cbs.push(resolve)
      this._check()
    })
  }

  /**
   * Check counter value.
   */

  _check() {
    if (this.n == 0) this._done()
  }

  /**
   * Resume waiting routines.
   */

  _done() {
    const cbs = this.cbs
    this.cbs = []
    cbs.forEach(cb => cb())
  }
}
