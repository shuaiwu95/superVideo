import Control from './Control'
import eventType from '../events/EventType'

/**
 * @classdesc
 * 控件 下一个
 * @class NextControl
 * @extends {Control}
 */
class NextControl extends Control {
  constructor () {
    super()
  }
  create_ () {
    const nextBtn = document.createElement('button')
    nextBtn.className = 'sv-nextBtn sv-font sv-next'
    nextBtn.innerHTML = '&#xe67d;'
    this.element_.appendChild(nextBtn)
    nextBtn.onclick = () => {
      this.dispatchEvent(eventType.CLICK)
    }
  }
}

export default NextControl