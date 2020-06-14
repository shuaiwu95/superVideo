import Target from '../events/Target'
import ModeType from './ModeType'
import Videopc from './Videopc'
import VideoSource from '../source/VideoSource'
import Control from '../control/Control'
import eventType from '../events/EventType'

/**
 * @classdesc
 * 核心类 SuperVideo
 * @class Svideo
 * @extends {Target}
 */
class Svideo extends Target{
  constructor (target, videoOption = {}) {
    const defaultOption = {
      'target': null, // 目标容器
      'source': null, // 播放资源
      'autoplay': false, // 是否自动播放
      'mode': ModeType.PC, // 选择渲染模式 pc or mb
      'currentTime': 0, // 设置视频的播放位置
      'loop': false, // 循环
      'muted': false, // 是否关闭声音
      'playbackRate': 1, // 视频播放速度
      'poster': '', // 视频POSTER
      'volume': 1, // 音量
      'leftControls': [], // 左槽控件
      'rightControls': [] // 右槽控件
    }
    defaultOption.target = target
    super()
    this.option = Object.assign({}, defaultOption, videoOption)
    this.video_ = null
    this.init()
  }

  /**
   *
   * init render
   * @memberof Svideo
   */
  init () {
    const target = this.option.target
    const source = this.option.source
    let videoTarget = this.videoTarget_ = null
    let videoSource = this.videoSource_ = null
    if (typeof target === 'string') {
      videoTarget = document.getElementById(target)
    } else {
      videoTarget = target
    }
    if (!(source instanceof VideoSource)) {
      videoSource = new VideoSource({'src': source})
    } else {
      videoSource = source
    }
    switch (this.option.mode) {
    case ModeType.PC:
      this.video_ = new Videopc({
        'target': videoTarget,
        'source': videoSource,
        'autoplay': this.option.autoplay,
        'currentTime': this.option.currentTime,
        'loop': this.option.loop,
        'muted': this.option.muted,
        'playbackRate': this.option.playbackRate,
        'poster': this.option.poster,
        'volume': this.option.volume,
        'leftControls': this.option.leftControls,
        'rightControls': this.option.rightControls
      })
      break
    case ModeType.MB:

      break
    default:
      break
    }
    // 监听事件
    this.video_.ontimeupdate_ = (video) => {
      this.dispatchEvent(eventType.CHANGE)
    }

    this.video_.onready_ = () => {
      this.dispatchEvent(eventType.READY)
    }
  }

  /**
   * @description 获取目标容器
   * @returns {Element}
   * @memberof Svideo
   */
  getContainer () {
    return this.videoTarget_
  }

  /**
   * @description 添加播放资源
   *
   * @param {*} source
   * @memberof Svideo
   */
  setSource (source) {
    let videoSource
    if (!(source instanceof VideoSource)) {
      videoSource = new VideoSource({'src': source})
    } else {
      videoSource = source
    }
    this.removeSource()
    this.video_.video_.load()
    this.video_.addSource_(videoSource)
  }

  /**
   * @description 移除资源
   *
   * @memberof Svideo
   */
  removeSource () {
    const childVideoDom = this.video_.video_
    childVideoDom.removeChild(this.video_.source_)
  }

  /**
   * @description 开始播放
   *
   * @memberof Svideo
   */
  play () {
    this.video_.play_()
  }

  /**
   * @description 暂停
   *
   * @memberof Svideo
   */
  pause () {
    this.video_.pause_()
  }

  /**
   * @description 返回视频时长
   *
   * @returns
   * @memberof Svideo
   */
  getAllTime () {
    return this.video_.getAllTime_()
  }

  /**
   * @description 返回当前视频的播放位置
   *
   * @returns
   * @memberof Svideo
   */
  getCurrentTime () {
    return this.video_.getCurrentTime_()
  }

  /**
   * @description 设置播放进度
   *
   * @param {Number} time 秒
   * @memberof Svideo
   */
  setCurrentTime (time) {
    this.video_.setCurrentTimeClone_(time)
  }

  /**
   * @description 视频是否准备就绪
   *
   * @returns
   * @memberof Svideo
   */
  isReady () {
    return this.video_.isReady_()
  }

  /**
   * @description 视频是否播放结束
   *
   * @returns
   * @memberof Svideo
   */
  isEnded () {
    return this.video_.isEnded_()
  }

  /**
   * @description 设置是否循环播放
   *
   * @param {boolean} [bol=true]
   * @memberof Svideo
   */
  setLoop (bol = true) {
    this.video_.setLoop_(bol)
  }

  /**
   * @description 获取是否循环播放
   *
   * @returns
   * @memberof Svideo
   */
  isLoop () {
    return this.video_.isLoop_()
  }

  /**
   * @description 设置是否静音
   *
   * @param {boolean} [bol=true]
   * @memberof Svideo
   */
  setMuted (bol = true) {
    this.video_.setMuted_(bol)
  }

  /**
   * @description 获取是否静音
   *
   * @returns
   * @memberof Svideo
   */
  isMuted () {
    return this.video_.isMuted_()
  }

  /**
   * @description 返回网络状况
   *
   * @returns
   * @memberof Svideo
   */
  getNetworkState () {
    return this.video_.getNetworkState_()
  }

  /**
   * @description 视频是否在播放
   *
   * @returns
   * @memberof Svideo
   */
  isPlay () {
    return this.video_.isPlay_()
  }

  /**
   * @description 获取播放速度
   *
   * @returns
   * @memberof Svideo
   */
  getPlaybackRate () {
    return this.video_.getPlaybackRate_()
  }

  /**
   * @description 设置播放速度
   *
   * @returns
   * @memberof Svideo
   */
  setPlaybackRate (num = 1) {
    this.video_.setPlaybackRate_(num)
  }

  /**
   * @description 设置POSTER
   *
   * @param {string} [str='']
   * @memberof Svideo
   */
  setPoster (str = '') {
    this.video_.setPoster_(str)
  }

  /**
   * @description 设置音量
   *
   * @param {number} [num=1]
   * @memberof Svideo
   */
  setVolume (num = 1) {
    this.video_.setVolume_(num)
  }

  /**
   * @description 获取音量
   *
   * @memberof Svideo
   */
  getVolume (num = 1) {
    return this.video_.getVolume_(num)
  }

  /**
   * @description 往控件栏左槽添加控件
   *
   * @memberof Svideo
   */
  addControlLeft (control) {
    if (control instanceof Control) {
      this.video_.addControlLeft_(control)
    }
  }

  /**
   * @description 往控件栏右槽添加控件
   *
   * @memberof Svideo
   */
  addControlRight (control) {
    if (control instanceof Control) {
      this.video_.addControlRight_(control)
    }
  }

  /**
   * @description 进入全屏
   *
   * @memberof Svideo
   */
  fullScreen () {
    this.video_.fullScreen_()
  }

  /**
   * @description 退出全屏
   *
   * @memberof Svideo
   */
  cancelFullScreen () {
    this.video_.cancelFullScreen_()
  }
}
export default Svideo