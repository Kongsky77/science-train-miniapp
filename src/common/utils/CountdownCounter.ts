export default class CountdownCounter {

  private countdownNumber: number
  private id: any
  private callback: (residueDegree: number) => void

  constructor (countdownNumber: number, callback: (residueDegree: number) => void) {
    this.countdownNumber = countdownNumber
    this.callback = callback
  }

  startCountdown () {
    this.id = setInterval(() => {
      this.countdownNumber = this.countdownNumber - 1
      if (this.countdownNumber <= 0) {
        this.stopCountdown(this.id)
      }
      this.callback(this.countdownNumber)
    }, 1000)
  }

  private stopCountdown (id: any) {
    clearInterval(id)
  }

  pauseCountdown() {
    clearInterval(this.id)
  }
}
