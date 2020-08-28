import Control from './Control'
import eventType from '../events/EventType'

/**
 * @classdesc
 * 控件 全屏
 * @class NextControl
 * @extends {Control}
 */
class FullScreenControl extends Control {
  constructor () {
    super()
    this.isFull_ = false
    this.type_ = 'fullScreenMenu'
  }
  create_ () {
    const fullScreen = this.fullScreenBtn_ = document.createElement('button')
    fullScreen.className = 'sv-nextBtn sv-font sv-fullScreen'
    fullScreen.innerHTML = '&#xe6cc;'
    this.element_.appendChild(fullScreen)
    fullScreen.onclick = () => {
      if (this.isFull_) {
        this.video_.cancelFullScreen_()
        fullScreen.innerHTML = '&#xe6cc;'
        this.dispatchEvent(eventType.CANCELFULLSCREEN)
        this.isFull_ = false
      } else {
        this.video_.fullScreen_()
        fullScreen.innerHTML = '&#xe71f;'
        this.dispatchEvent(eventType.FULLSCREEN)
        this.isFull_ = true
      }
    }
  }
}

export default FullScreenControl