import Target from '../events/Target'
import { formatSeconds } from '../util/formatTime'
import '../../css/videoControl-pc.css'

class Videopc extends Target {
  constructor (videopcOption = {}) {
    const defaultOption = {
      'target': null,
      'source': null,
      'autoplay': false
    }
    super()
    this.option = Object.assign({}, defaultOption, videopcOption)
    this.createElement_()
  }


  /**
   * @description 创建VIDEO标签
   *
   * @memberof Videopc
   */
  createElement_ () {
    const targetElement = this.option.target
    targetElement.className = 'sv-target'
    const video = this.video_ = document.createElement('VIDEO')
    video.setAttribute('width', '100%')
    video.setAttribute('height', '100%')
    // video.setAttribute('controls', 'controls')
    video.autoplay = this.option.autoplay
    video.currentTime = this.option.currentTime
    video.loop = this.option.loop
    video.muted = this.option.muted
    video.playbackRate = this.option.playbackRate
    video.poster = this.option.poster
    video.volume = this.option.volume
    targetElement.appendChild(video)
    this.addSource_()
    this.createControlContainer_(targetElement)
  }

  /**
   * @description 控件容器
   *
   * @memberof Videopc
   */
  createControlContainer_ (targetElement) {
    const control = this.control_ = document.createElement('div')
    control.className = 'sv-control'
    targetElement.appendChild(control)
    // playMenu container
    const playContainer = document.createElement('div')
    playContainer.className = 'sv-play-container'
    control.appendChild(playContainer)
    // playMenu
    const playMenu = this.playMenu_ = document.createElement('button')
    playContainer.appendChild(playMenu)
    const btnInner = this.btnInner_ = document.createElement('span')
    btnInner.innerHTML = '&#xe60f;'
    btnInner.className = 'sv-font sv-play'
    playMenu.appendChild(btnInner)
    // time
    const timeRang = document.createElement('div')
    timeRang.className = 'sv-time'
    playContainer.appendChild(timeRang)
    const timeStart = this.timeStart_ = document.createElement('span')
    timeStart.className = 'sv-time-s'
    timeStart.innerHTML = '00:00'
    const split = document.createElement('span')
    split.className = 'sv-time-split'
    split.innerHTML = '/'
    const timeEnd = this.timeEnd_ = document.createElement('span')
    timeEnd.className = 'sv-time-e'
    timeEnd.innerHTML = '00:00'
    timeRang.appendChild(timeStart)
    timeRang.appendChild(split)
    timeRang.appendChild(timeEnd)

    // control
    const controlRight = this.controlRight_ = document.createElement('div')
    controlRight.className='sv-control-r'
    control.appendChild(controlRight)
    const muteMenu = this.muteMenu_ = document.createElement('button')
    controlRight.appendChild(muteMenu)
    const muteInner = this.muteInner_ = document.createElement('span')
    muteInner.innerHTML = '&#xe753;'
    muteInner.className = 'sv-font sv-play'
    muteMenu.appendChild(muteInner)

    // mutePanel
    const mutePanel = this.mutePanel_ = document.createElement('div')
    mutePanel.className = 'sv-mutePanel hide'
    muteMenu.appendChild(mutePanel)

    // 显示音量调节控件
    muteMenu.onmousemove = () => {
      mutePanel.classList.remove('hide')
    }
    muteMenu.onmouseleave = () => {
      mutePanel.classList.add('hide')
    }


    // 获取视频总时长
    const timer = setInterval(() => {
      if (this.video_.readyState) {
        timeEnd.innerHTML = formatSeconds(this.getAllTime_())
        this.onready_()
        clearInterval(timer)
      }
    })

    // 点击播放 | 暂停
    playMenu.onclick = () => {
      const isPlay = this.isPlay_()
      if (isPlay) { // 在播放
        this.pause_()
        btnInner.innerHTML = '&#xe60f;'
      } else { // 已暂停
        this.play_()
        btnInner.innerHTML = '&#xe693;'
      }
    }
  }

  /**
   * @private
   * @description 添加资源
   * @memberof Videopc
   */
  addSource_ (source) {
    const video = this.video_
    this.source_ = source ? source.getSource() : this.option.source.getSource()
    video.appendChild(this.source_)
    video.ontimeupdate = () => {
    //   console.log(video.currentTime)
    //   console.log(video.duration)
      this.ontimeupdate_(video)
      if (video.paused) { // 暂停
        this.btnInner_.innerHTML = '&#xe60f;'
      } else { // 开始
        this.btnInner_.innerHTML = '&#xe693;'
      }
      // 获取当前播放时长
      this.timeStart_.innerHTML = formatSeconds(this.getCurrentTime_())
    }
  }

  ontimeupdate_ () {}
  onready_ () {}

  /**
   * @description 开始播放
   *
   * @memberof Videopc
   */
  play_ () {
    this.video_.play()
  }

  /**
   * @description 暂停
   *
   * @memberof Videopc
   */
  pause_ () {
    this.video_.pause()
  }

  /**
   * @description 返回视频时长
   *
   * @returns
   * @memberof Videopc
   */
  getAllTime_ () {
    return this.video_.duration
  }

  /**
   * @description 返回当前视频的播放位置
   *
   * @returns
   * @memberof Videopc
   */
  getCurrentTime_ () {
    return this.video_.currentTime
  }

  /**
   * @description 视频是否播放结束
   *
   * @returns
   * @memberof Videopc
   */
  isEnded_ () {
    return this.video_.ended
  }

  /**
   * @description 设置是否循环播放
   *
   * @param {boolean} [bol=true]
   * @memberof Videopc
   */
  setLoop_ (bol = true) {
    this.video_.loop = bol
  }

  /**
   * @description 获取是否循环播放
   *
   * @returns
   * @memberof Videopc
   */
  isLoop_ () {
    return this.video_.loop
  }

  /**
   * @description 设置是否静音
   *
   * @param {boolean} [bol=true]
   * @memberof Videopc
   */
  setMuted_ (bol = true) {
    this.video_.muted = bol
  }

  /**
   * @description 获取是否静音
   *
   * @returns
   * @memberof Videopc
   */
  isMuted_ () {
    return this.video_.muted
  }

  /**
   * @description 返回网络状况
   *
   * @returns
   * @memberof Videopc
   */
  getNetworkState_ () {
    return this.video_.networkState
  }

  /**
   * @description 视频是否在播放
   *
   * @returns
   * @memberof Videopc
   */
  isPlay_ () {
    return !this.video_.paused
  }

  /**
   * @description 获取播放速度
   *
   * @returns
   * @memberof Videopc
   */
  getPlaybackRate_ () {
    return this.video_.playbackRate
  }

  /**
   * @description 设置播放速度
   *
   * @returns
   * @memberof Videopc
   */
  setPlaybackRate_ (num = 1) {
    this.video_.playbackRate = num
  }

  /**
   * @description 设置POSTER
   *
   * @param {string} [str='']
   * @memberof Videopc
   */
  setPoster_ (str = '') {
    this.video_.poster = str
  }

  /**
   * @description 设置音量
   *
   * @param {number} [num=1]
   * @memberof Videopc
   */
  setVolume_ (num = 1) {
    this.video_.volume = num
  }

  /**
   * @description 获取音量
   *
   * @memberof Videopc
   */
  getVolume_ (num = 1) {
    return this.video_.volume
  }

}
export default Videopc