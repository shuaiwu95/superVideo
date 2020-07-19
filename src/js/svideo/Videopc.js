import Target from '../events/Target'
import ModeType from './ModeType'
import { formatSeconds } from '../util/formatTime'
import '../../css/videoControl-pc.css'
import EventType from '../events/EventType'
import Barrage from './Barrage'
import sourceType from '../source/sourceType'

/**
 * @classdesc
 * PC端视频渲染引擎
 * 内置了大多数视频相关函数
 * MB端继承此类大部分方法属性
 * @class Videopc
 * @extends {Target}
 */
class Videopc extends Target {
  constructor (videopcOption = {}) {
    const defaultOption = {
      'target': null,
      'source': null,
      'autoplay': false
    }
    super()
    this.option = Object.assign({}, defaultOption, videopcOption)
    this.rollBarrage_ = false
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
    video.onloadedmetadata = () => {
      video.currentTime = this.option.currentTime
    }
    video.loop = this.option.loop
    video.muted = this.option.muted
    video.playbackRate = this.option.playbackRate
    video.poster = this.option.poster
    video.volume = this.option.volume
    targetElement.appendChild(video)
    // loading
    this.createLoading_()
    // addSource
    this.addSource_()
    this.createControlContainer_(targetElement)

    // add defaault control
    const leftControls = this.option.leftControls
    const rightControls = this.option.rightControls
    const centerControls = this.option.centerControls
    if (leftControls.length > 0) {
      leftControls.forEach(item => {
        this.addControlLeft_(item)
      })
    }
    if (rightControls.length > 0) {
      rightControls.forEach(item => {
        this.addControlRight_(item)
      })
    }
    if (centerControls.length > 0) {
      centerControls.forEach(item => {
        this.addControlCenter_(item)
      })
    }

    // events
    this.listenerEvents_()
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
    playMenu.className = 'sv-playBtn'
    playContainer.appendChild(playMenu)
    const btnInner = this.btnInner_ = document.createElement('span')
    btnInner.innerHTML = '&#xe60f;'
    btnInner.className = 'sv-font sv-play'
    playMenu.appendChild(btnInner)
    // left control
    const controlLeft_ = this.leftControl_ = document.createElement('div')
    controlLeft_.className = 'sv-control-left'
    playContainer.appendChild(controlLeft_)
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

    // center slote
    const controlCenter = this.controlCenter_ = document.createElement('div')
    controlCenter.className='sv-control-c'
    control.appendChild(controlCenter)

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
    if (this.option.mode === ModeType.MB) {
      muteMenu.style.display = 'none'
    }
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
    progressBtn.className = 'sv-progressBtn'
    const progressBtnInside = document.createElement('div')
    progressBtn.appendChild(progressBtnInside)
    progressBar.appendChild(progressBtn)
    // 音量调节
    this.sliderRange_(muteSliderButton, muteSliderRange)
    this.setVolume_(this.option.volume)
    // 判断是否静音
    this.setMuteIcon_()
    // 为默认控件设置事件
    this.setEventDefaultControl_()

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

    // 画中画
    this.isPip_ = false
    const picinpic = document.createElement('div')
    picinpic.className = 'sv-picinpic sv-font'
    this.option.target.appendChild(picinpic)
    picinpic.innerHTML = '<span class="sv-pic-pic">&#xe613;</span><span id="sv-hzh">画中画</span>'
    picinpic.onclick = () => {
      if (this.isPip_) {
        this.leavePicInPic_()
      } else {
        this.enterPicInPic_()
      }
    }

    const isChrome = window.navigator.userAgent.indexOf('Chrome') > -1
    if (this.option.mode === ModeType.MB) {
      picinpic.classList.add('hide')
    }
    if (!this.option.showPictureInPicture || !isChrome) {
      picinpic.classList.add('hide')
    }

    // 如果是直播流，则隐藏进度条
    if (this.sourceType === sourceType.M3U8) {
      this.progressBar_.classList.add('hide')
      timeRang.classList.add('hide')
    }
  }

  /**
   * @description 为默认控件绑定事件
   *
   * @memberof Videopc
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
    // 控制进度条
    progressBar.onmouseover = () => {
      progressBar.style.height = '4px'
    }
    progressBar.onmouseout = () => {
      progressBar.style.height = '2px'
    }
    progressBtn.onmousedown = (e) => {
      // 获取鼠标按下的坐标
      const x = e.clientX
      const l = progressBtn.offsetLeft
      const max = progressBar.offsetWidth - progressBtn.offsetWidth
      const progressBarLen = progressBar.clientWidth
      let progressTime = 0
      document.onmousemove = (ev) => {
        this.pause_()
        const mx = ev.clientX
        const to = Math.min(max, Math.max(-2, l + (mx - x)))
        // console.log(to)
        const fenbi = to/progressBarLen
        const baifenbi = `${fenbi * 100}%`
        progressBtn.style.left = baifenbi
        this.progressNum_.style.width = baifenbi
        const allTime = this.getAllTime_()
        progressTime = allTime * fenbi
        this.timeStart_.innerHTML = formatSeconds(progressTime)
        ev.preventDefault()
      }
      document.onmouseup = () => {
        document.onmousemove = null
        document.onmouseup = null
        this.play_()
        this.setCurrentTime_(progressTime)
        this.clearBarrages_()
      }
      e.preventDefault()
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
    this.showLoad_()
    const video = this.video_
    this.source_ = source ? source : this.option.source
    const type = this.sourceType =  this.source_.getType()
    switch (type) {
      case sourceType.MP4:
        video.appendChild(this.source_.getSource())
        break
      case sourceType.M3U8:
        this.source_.getSource().attachMedia(video)
        break
      default:
        break
    }
    video.ontimeupdate = null
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
      const allTime = this.getAllTime_()
      if (allTime > 0) {
        for (let i = 0; i < video.buffered.length; i++) {
          // 寻找当前时间之后最近的点
          if (video.buffered.start(video.buffered.length - 1 - i) < video.currentTime) {
            let bufferedLength = video.buffered.end(video.buffered.length - 1 - i) / allTime * 100 +
                  '%'
            this.cacheProgress_.style.width = bufferedLength
            break
          }
        }
        const nowTime = this.getCurrentTime_()
        this.progressNum_.style.width = `${nowTime/allTime * 100}%`
        const btnLen = this.progressBar_.clientWidth * (nowTime/allTime)
        if (this.isReady_()) {
          this.progressBtn_.style.left = `${btnLen}px`
        }
      }
      this.hideLoad_()
    }
    // 获取视频总时长
    const timer = setInterval(() => {
      if (this.video_.readyState) {
        this.cacheProgress_.style.width = this.progressNum_.style.width = '0%'
        this.progressBtn_.style.left = '0px'
        this.timeEnd_.innerHTML = formatSeconds(this.getAllTime_())
        this.onready_()
        clearInterval(timer)
      }
    })
  }

  createLoading_ () {
    const div = `
    <span></span>
    <span></span>
    <span></span>
    <span></span>
    <span></span>
    `
    const objE = this.loading_ = document.createElement('div')
    objE.innerHTML = div
    objE.className = 'sv-loading hide'
    this.option.target.appendChild(objE)
  }

  showLoad_ () {
    this.loading_.classList.remove('hide')
  }

  hideLoad_ () {
    this.loading_.classList.add('hide')
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
    // 如果是直播，则直接加载到最后
    if (this.sourceType === sourceType.M3U8) {
      this.setCurrentTime_(this.getAllTime_())
    }
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
    this.showLoad_()
  }

  setCurrentTimeClone_(time) {
    this.video_.currentTime = time
    const allTime = this.getAllTime_()
    this.progressNum_.style.width = `${time/allTime * 100}%`
    const btnLen = this.progressBar_.clientWidth * (time/allTime)
    if (this.isReady_()) {
      this.progressBtn_.style.left = `${btnLen - 16}px`
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

  /**
   * @description 往控件栏左槽添加控件
   *
   * @memberof Videopc
   */
  addControlLeft_ (control) {
    this.leftControl_.appendChild(control.init_(this))
  }

  /**
   * @description 往控件栏右槽添加控件
   *
   * @memberof Videopc
   */
  addControlRight_ (control, pre = false) {
    if (pre) {
      this.controlRight_.prepend(control.init_(this))
    } else {
      this.controlRight_.appendChild(control.init_(this))
    }
  }

  /**
   * @description
   * 往中间插槽添加控件
   * @param {*} control
   * @memberof Videopc
   */
  addControlCenter_ (control) {
    this.controlCenter_.appendChild(control.init_(this))
  }

  /**
   * @description 进入全屏
   *
   * @memberof Videopc
   */
  fullScreen_ () {
    const element = document.documentElement
    if (element.requestFullScreen) {
      element.requestFullScreen()
    } else if (element.mozRequestFullScreen) {
      element.mozRequestFullScreen()
    } else if (element.webkitRequestFullScreen) {
      element.webkitRequestFullScreen()
    }
    this.option.target.classList.add('sv-full-screen')
    this.videoEvent_(EventType.FULL_SCREEN)
  }

  /**
   * @description 退出全屏
   *
   * @memberof Videopc
   */
  cancelFullScreen_ () {
    const de = document
    if (de.exitFullscreen) {
      de.exitFullscreen()
    } else if (de.mozCancelFullScreen) {
      de.mozCancelFullScreen()
    } else if (de.webkitCancelFullScreen) {
      de.webkitCancelFullScreen()
    }
    this.option.target.classList.remove('sv-full-screen')
    this.videoEvent_(EventType.CANCEL_FULL_SCREEN)
  }

  /**
   * @description
   * 弹幕
   * @param {string | Barrage}
   * @memberof Videopc
   */
  addBarrage_ (arg) {
    let text = null
    let color = '#ffffff'
    let fontSize = '14px'
    let fontFamily = '微软雅黑'
    let fontWeight = '100'
    let minTop = 80
    let leftDom = null
    let rightDom = null
    if (typeof arg === 'string') {
      text = arg
    } else {
      text = arg.getText()
      color = arg.getColor()
      fontSize = arg.getFontSize()
      fontFamily = arg.getFontFamily()
      fontWeight = arg.getFontWeight()
      leftDom = arg.getLeftDom()
      rightDom = arg.getRightDom()
    }
    const dom = this.option.target
    const barrage = document.createElement('div')
    barrage.className = 'sv-brrage'
    const barrageLeft = document.createElement('div')
    barrageLeft.className = 'sv-brrage-left'
    if (leftDom !== null) {
      barrageLeft.appendChild(leftDom)
    }
    if (rightDom !== null) {
      barrageLeft.appendChild(rightDom)
    }
    const barrageCenter = document.createElement('div')
    barrageCenter.className = 'sv-brrage-center'
    barrageCenter.innerHTML = text
    barrageCenter.style.color = color
    barrageCenter.style.fontSize = fontSize
    barrageCenter.style.fontFamily = fontFamily
    barrageCenter.style.fontWeight = fontWeight
    const barrageRight = document.createElement('div')
    barrageRight.className = 'sv-brrage-right'
    barrage.appendChild(barrageLeft)
    barrage.appendChild(barrageCenter)
    barrage.appendChild(barrageRight)
    dom.appendChild(barrage)
    dom.style.overflow = 'hidden'
    const rect = dom.getBoundingClientRect()
    const domWidth = rect.right - rect.left
    const domHeight = rect.bottom - rect.top
    // 定义弹幕位置
    barrage.style.left = domWidth + 'px'
    barrage.style.top = (domHeight - minTop) * Number(Math.random().toFixed(2)) + 'px'
    // 滚动弹幕
    let animateId = null
    let roll = (timer) => {
      let now = Number(new Date())
      roll.last = roll.last || now
      roll.timer = roll.timer || timer
      let left = barrage.offsetLeft
      let rect2 = barrage.getBoundingClientRect()
      if (left < rect2.left - rect2.right) {
        dom.removeChild(barrage)
      } else {
        if (now - roll.last >= roll.timer) {
          roll.last = now
          left -= 3
          barrage.style.left = left + 'px'
        }
        animateId = requestAnimationFrame(roll)
      }
    }

    if (this.rollBarrage_) {
      roll(50 * Number(Math.random().toFixed(2)))
    }

    // 开始暂停弹幕
    this.addEventListener('pause', () => {
      cancelAnimationFrame(animateId)
    })
    this.addEventListener('play', () => {
      roll(50 * Number(Math.random().toFixed(2)))
    })
  }

  /**
   * @description
   * 清空弹幕
   * @memberof Videopc
   */
  clearBarrages_ () {
    const barrages = document.getElementsByClassName('sv-brrage')
    for (let i = 0; i < barrages.length;i ++){
      const barrage = barrages[i]
      this.option.target.removeChild(barrage)
    }
    if (barrages.length > 0) {
      this.clearBarrages_()
    }
  }

  /**
   * @description
   * 进入画中画模式
   * @memberof Videopc
   */
  enterPicInPic_ () {
    this.video_.requestPictureInPicture()
  }

  /**
   * @description
   * 退出画中画模式
   * @memberof Videopc
   */
  leavePicInPic_ () {
    document.exitPictureInPicture()
  }

  /**
   * @description
   * 事件监听
   * @memberof Videopc
   */
  listenerEvents_ () {
    // 开始播放
    this.eventFn_('play', EventType.PLAY)
    // 正在请求数据
    this.eventFn_('loadstart', EventType.LOADS_SART)
    // 正在请求数据
    this.eventFn_('suspend', EventType.SUSPEND)
    // 非错误引起的终止下载
    this.eventFn_('abort', EventType.ABORT)
    // 客户端正在请求数据
    this.eventFn_('progress', EventType.PROGRESS)
    // 请求数据时遇到错误
    this.eventFn_('error', EventType.ERROR)
    // 网速失速
    this.eventFn_('stalled', EventType.STALLED)
    // 暂停播放
    this.eventFn_('pause', EventType.PAUSE)
    // 成功获取资源长度
    this.eventFn_('loadedmetadata', EventType.LOADED_METADATA)
    // 等待数据，并非错误
    this.eventFn_('waiting', EventType.WAITING)
    // 开始回放
    this.eventFn_('playing', EventType.PLAYING)
    // 播放时长改变
    this.eventFn_('timeupdate', EventType.TIME_UPDATE)
    // 播放结束
    this.eventFn_('ended', EventType.ENDED)
    // 播放速率改变
    this.eventFn_('ratechange', EventType.RATE_CHANGE)
    // 音量改变
    this.eventFn_('volumechange', EventType.VOLUME_CHANGE)
    // 进入画中画 || 退出画中画
    this.eventFn_('enterpictureinpicture', EventType.ENTER_PIP)
    this.eventFn_('leavepictureinpicture', EventType.LEAVE_PIP)
  }

  eventFn_ (videoEvent, customEvent) {
    this.video_.addEventListener(videoEvent, () => {
      this.dispatchEvent(customEvent)
      switch (customEvent) {
      case EventType.ERROR: // 当播放遇到错误时
        console.error('error')
        break
      case EventType.ABORT: // 当播放遇到错误时
        console.error('abort')
        break
      case EventType.PLAY:
        this.rollBarrage_ = true
        break
      case EventType.PAUSE:
        this.rollBarrage_ = false
        break
      case EventType.WAITING:
        this.showLoad_()
        break
      case EventType.ENTER_PIP:
        document.getElementById('sv-hzh').innerHTML = '画中画使用中'
        this.isPip_ = true
        break
      case EventType.LEAVE_PIP:
        document.getElementById('sv-hzh').innerHTML = '画中画'
        this.isPip_ = false
        break
      default:
        break
      }
      this.videoEvent_(customEvent)
    })
  }

  videoEvent_ () {}

}
export default Videopc