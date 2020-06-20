import Videopc from './Videopc'
import { formatSeconds } from '../util/formatTime'

/**
 * @classdesc
 * 兼容移动端
 * @class Videomb
 * @extends {Videopc}
 */
class Videomb extends Videopc {
  constructor (videombOption = {}) {
    const defaultOption = {
      'target': null,
      'source': null,
      'autoplay': false
    }
    const option = Object.assign({}, defaultOption, videombOption)
    super(option)
  }

  /**
   * @description 为默认控件绑定事件
   *
   * @memberof Videomb
   */
  setEventDefaultControl_ () {
    const muteMenu = this.muteMenu_
    const mutePanel = this.mutePanel_
    const progressBar = this.progressBar_
    const progressBtn = this.progressBtn_

    // 显示音量调节控件
    muteMenu.onmouseover = () => {
      mutePanel.classList.remove('hide')
    }
    let timerMute = null
    muteMenu.onmouseleave = () => {
      timerMute = setTimeout(() => {
        mutePanel.classList.add('hide')
        clearTimeout(timerMute)
      }, 500)
    }

    mutePanel.onmouseover = () => {
      mutePanel.classList.remove('hide')
      clearTimeout(timerMute)
    }
    mutePanel.onmouseleave = () => {
      mutePanel.classList.remove('hide')
    }

    mutePanel.onclick = (event) => {
      event.stopPropagation()
    }
    // 控制进度条
    progressBar.onmouseover = () => {
      progressBar.style.height = '4px'
    }
    progressBar.onmouseout = () => {
      progressBar.style.height = '2px'
    }

    let max = null
    let x = null
    let l = null
    let progressBarLen = null
    let progressTime = null
    const progressTouchStart = (e) => {
      // 获取鼠标按下的坐标
      const te = e.targetTouches[0]
      x = te.clientX
      l = progressBtn.offsetLeft
      max = progressBar.offsetWidth - progressBtn.offsetWidth
      progressBarLen = progressBar.clientWidth
      progressTime = 0
      document.addEventListener('touchmove', touchMove, { 'passive': false })
      document.addEventListener('touchend', touchEnd)
      e.preventDefault()
    }

    const touchEnd = () => {
      document.removeEventListener('touchmove', touchMove)
      document.removeEventListener('touchend', touchEnd)
      this.play_()
      this.setCurrentTime_(progressTime)
      this.clearBarrages_()
    }

    const touchMove = (ev) => {
      this.pause_()
      const evt = ev.targetTouches[0]
      const mx = evt.clientX
      const to = Math.min(max, Math.max(-2, l + (mx - x)))
      const fenbi = to/progressBarLen
      const baifenbi = `${fenbi * 100}%`
      progressBtn.style.left = baifenbi
      this.progressNum_.style.width = baifenbi
      const allTime = this.getAllTime_()
      progressTime = allTime * fenbi
      this.timeStart_.innerHTML = formatSeconds(progressTime)
      ev.preventDefault()
    }
    progressBtn.addEventListener('touchstart', progressTouchStart, { 'passive': false })
  }
}
export default Videomb