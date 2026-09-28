interface CountConfigs {
  time?: number
  onUpdate?: Function
  onFinish?: Function
}

class Count {
  time = 60
  isStop = false
  onUpdate?: Function
  onFinish?: Function

  constructor (configs: CountConfigs = {}) {
    this.time = configs.time || 60
    this.onUpdate = configs.onUpdate
    this.onFinish = configs.onFinish
  }

  start () {
    this.update()
  }

  update () {
    if (this.isStop) {
      return
    }

    if (this.time === 0) {
      if (typeof this.onFinish === 'function') {
        this.onFinish(this.time)
      }
    } else {
      setTimeout(() => {
        this.time--
        if (typeof this.onUpdate === 'function') {
          this.onUpdate(this.time)
        }
        this.update()
      }, 1000)
    }
  }

  stop () {
    this.isStop = true
  }
}

export default Count
