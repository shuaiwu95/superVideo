import Control from './Control'

/**
 * @classdesc
 * 控件 倍速
 * @class NextControl
 * @extends {Control}
 */
class Dbspeen extends Control {
  constructor (dbspeedoption = {}) {
    const defaultOption = {
      'speeds': ['0.5', '1.0', '1.25', '1.5', '2.0']
    }
    super()
    this.option = Object.assign({}, defaultOption, dbspeedoption)
    this.active_ = '1.0'
    this.activeLi_ = null
    this.icon_ = {
      '1.0': '&#xe752;',
      '0.5': '&#xe754;',
      '1.25': '&#xe757;',
      '1.5': '&#xe758;',
      '2.0': '&#xe759;'
    }
  }
  create_ () {
    const speed = this.speed_ = document.createElement('button')
    speed.className = 'sv-speedBtn sv-font sv-next'
    const span = this.span_ = document.createElement('span')
    speed.appendChild(span)
    span.innerHTML = this.icon_[this.active_]
    this.element_.appendChild(speed)
    const speedControl = document.createElement('div')
    speedControl.className = 'sv-speed-btn hide'
    speed.appendChild(speedControl)
    const ul = document.createElement('ul')
    this.option.speeds.forEach(item => {
      const li = document.createElement('li')
      li.setAttribute('id', item)
      if (this.active_ === item) {
        li.className = 'sv-active'
        this.activeLi_ = li
      }
      li.innerHTML = `${item}X`
      li.onclick = () => {
        this.video_.setPlaybackRate_(Number(item))
        this.active_ = item
        span.innerHTML = this.icon_[this.active_]
        this.activeLi_.classList.remove('sv-active')
        li.className = 'sv-active'
        this.activeLi_ = li
      }
      ul.appendChild(li)
    })
    speedControl.appendChild(ul)

    // 显示音量调节控件
    speed.onmouseover = () => {
      speedControl.classList.remove('hide')
    }
    let timer = null
    speed.onmouseleave = () => {
      timer = setTimeout(() => {
        speedControl.classList.add('hide')
        clearTimeout(timer)
      }, 500)
    }

    speedControl.onmouseover = () => {
      speedControl.classList.remove('hide')
      clearTimeout(timer)
    }
    speedControl.onmouseleave = () => {
      speedControl.classList.remove('hide')
    }
  }

  /**
   * @description 设置速度
   *
   * @param {string} [num='1.0']
   * @memberof Dbspeen
   */
  setSpeed (num = '1.0') {
    if (this.option.speeds.indexOf(num) >= 0) {
      this.active_ = num
      this.span_.innerHTML = this.icon_[this.active_]
      const activeLi_ = document.getElementById(num)
      if ( this.activeLi_ !== null) {
        this.activeLi_.classList.remove('sv-active')
      }
      this.activeLi_ = activeLi_
      this.video_.setPlaybackRate_(Number(num))
    }
  }
}

export default Dbspeen