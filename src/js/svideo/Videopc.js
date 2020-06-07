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
    muteMenu.className = 'showMute'
    controlRight.appendChild(muteMenu)
    const muteInner = this.muteInner_ = document.createElement('span')
    muteInner.innerHTML = '&#xe753;'
    muteInner.className = 'sv-font sv-play'
    muteMenu.appendChild(muteInner)

    // mutePanel
    const mutePanel = this.mutePanel_ = document.createElement('div')
    mutePanel.className = 'sv-mutePanel hide'
    muteMenu.appendChild(mutePanel)
    // mute num
    const muteNum = this.muteNum_ = document.createElement('div')
    muteNum.className = 'sv-mute-num'
    muteNum.innerHTML = '100'
    // mute slider
    const muteSlider = this.muteSlider_ = document.createElement('div')
    muteSlider.className = 'sv-mute-slider'
    mutePanel.appendChild(muteNum)
    mutePanel.appendChild(muteSlider)
    // mute slider button
    const muteSliderRange = this.muteSliderRange_ = document.createElement('div')
    muteSliderRange.className = 'sv-mute-sliderRange'
    muteSlider.appendChild(muteSliderRange)
    const muteSliderButton = this.muteSliderButton_ = document.createElement('button')
    muteSliderButton.className = 'sv-mute-button'
    muteSlider.appendChild(muteSliderButton)
    // 进度条
    const progressBar = this.progressBar_ = document.createElement('div')
    progressBar.className = 'sv-progressBar'
    control.appendChild(progressBar)
    const cacheProgress = this.cacheProgress_ = document.createElement('div')
    cacheProgress.className = 'sv-cacheProgress'
    progressBar.appendChild(cacheProgress)
    const progressNum = this.progressNum_ = document.createElement('div')
    progressNum.className = 'sv-progressNum'
    progressBar.appendChild(progressNum)
    const progressBtn = this.progressBtn_ = document.createElement('div')
    progressBtn.className = 'sv-progressBtn hide'
    const progressBtnInside = document.createElement('div')
    progressBtn.appendChild(progressBtnInside)
    progressBar.appendChild(progressBtn)
    // 音量调节
    this.sliderRange_(muteSliderButton, muteSliderRange)
    this.setVolume_(this.option.volume)
    // 判断是否静音
    this.setMuteIcon_()

    // 显示音量调节控件
    muteMenu.onmouseover = () => {
      mutePanel.classList.remove('hide')
    }
    let timerMute = null
    muteMenu.onmouseleave = () => {
      timerMute = setTimeout(() => {
        mutePanel.classList.add('hide')
        clearTimeout(timerMute)
      }, 1500)
    }

    mutePanel.onmouseover = () => {
      mutePanel.classList.remove('hide')
      clearTimeout(timerMute)
    }
    mutePanel.onmouseleave = () => {
      mutePanel.classList.remove('hide')
    }

    // 点击按钮静音
    muteMenu.onclick = (event) => {
      if (this.isMuted_()) {
        this.setMuted_(false)
      } else {
        this.setMuted_(true)
      }
      event.stopPropagation()
    }

    mutePanel.onclick = (event) => {
      event.stopPropagation()
    }

    // 进度条事件处理
    progressBar.onmouseover = () => {
      progressBar.style.height = '4px'
      progressBtn.classList.remove('hide')
    }
    progressBar.onmouseleave = () => {
      progressBar.style.height = '2px'
      progressBtn.classList.add('hide')
    }

    progressBar.onclick = (event) => {
      let x = event.clientX
      const time = this.getCurrentByPx_(x - 12)
      this.setCurrentTime_(time)
    }

    // 控制进度条按钮
    let progressBarLen = progressBar.clientWidth
    progressBar.onmouseover = () => {
      progressBar.style.height = '4px'
      progressBtn.classList.remove('hide')
      progressBar.onmousedown = () => {
        // 获取鼠标按下的坐标
        let l = progressBar.offsetLeft
        document.onmousemove = (ev) => {
          // 获取鼠标移动时的坐标
          let x2 = ev.clientX
          if (x2 < 12 || x2 > progressBarLen) {
            return
          }
          progressBtn.style.left = `${x2 - 12}px`
          const progressLen = parseInt(((x2-12)/(progressBarLen - 12)).toFixed(2) * 100)/100
          const time = this.getCurrentByPx_(progressBarLen * progressLen)
          this.setCurrentTime_(time)
        }
        document.onmouseup = () => {
          document.onmousemove = null
          document.onmouseup = null
          progressBtn.classList.add('hide')
        }
      }
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
   * @description 滑块事件
   *
   * @param {*} cursor
   * @param {*} mask
   * @memberof Videopc
   */
  sliderRange_ (cursor, mask) {
    cursor.onmousedown = (evf) => {
      this._isCursor = true
      // event的兼容性
      let evF = evf||event
      // 获取鼠标按下的坐标
      let y1 = evF.clientY
      //获取元素的left，top值
      let t = cursor.offsetTop
      // 给可视区域添加鼠标的移动事件
      document.onmousemove = (ev) => {
      // 获取鼠标移动时的坐标
        let y2 = ev.clientY
        // 计算出鼠标的移动距离
        let y = y2 - y1
        // 移动的数值与元素的left，top相加，得出元素的移动的距离
        let lt = y + t
        // 更改元素的left，top值
        if (lt > 50 || lt < 0) {
          return
        }
        cursor.style.top = `${lt}px`
        let maskH = 50 - lt
        mask.style.height = `${maskH}px`
        this.setVolume_(maskH/50)
      }
      //清除
      document.onmouseup = () => {
        document.onmousemove = null
        document.onmouseup = null
        this._isCursor = false
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
      // 判断是否静音
      this.setMuteIcon_()
      // 进度条数据
      const bufferEnd = video.buffered.end(0)
      const allTime = this.getAllTime_()
      const nowTime = this.getCurrentTime_()
      this.cacheProgress_.style.width = `${bufferEnd/allTime * 100}%`
      this.progressNum_.style.width = `${nowTime/allTime * 100}%`
      const btnLen = this.progressBar_.clientWidth * (nowTime/allTime)
      if (this.isReady_()) {
        this.progressBtn_.style.left = `${btnLen - 12}px`
      }
    }
  }

  /**
   * @description 设置声音图标状态
   *
   * @memberof Videopc
   */
  setMuteIcon_ () {
    // 判断是否静音
    if (this.isMuted_()) {
      this.muteInner_.innerHTML = '&#xe63e;'
    } else {
      this.muteInner_.innerHTML = '&#xe753;'
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
   * @description 设置播放进度
   *
   * @param {*} time
   * @memberof Videopc
   */
  setCurrentTime_ (time) {
    this.video_.currentTime = time
    const allTime = this.getAllTime_()
    const nowTime = time
    const btnLen = this.progressBar_.clientWidth * (nowTime/allTime)
    if (this.isReady_()) {
      this.progressBtn_.style.left = `${btnLen - 12}px`
    }
  }

  /**
   * @description 将像素长度转为播放时长
   *
   * @memberof Videopc
   */
  getCurrentByPx_ (px) {
    const allTime = this.getAllTime_()
    const prossBarLen = this.progressBar_.clientWidth
    return allTime * (px/prossBarLen)
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
    this.setMuteIcon_()
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
    this.muteNum_.innerHTML = parseInt(num * 100)
    this.muteSliderRange_.style.height = `${num * 100/2}px`
    this.muteSliderButton_.style.top = `${50 - num * 100/2}px`
    if (num > 0) {
      this.setMuted_(false)
    } else {
      this.setMuted_(true)
    }
  }

  /**
   * @description 获取音量
   *
   * @memberof Videopc
   */
  getVolume_ () {
    return this.video_.volume
  }

  /**
   * @description 是否就绪
   *
   * @returns
   * @memberof Videopc
   */
  isReady_ () {
    return this.video_.readyState === 4
  }

}
export default Videopc