import Hls from 'hls.js'
import sourceType from './sourceType'
class VideoSource {
  constructor (videoSourceOption = {}) {
    const defaultOption = {
      'src': '',
      'type': sourceType.MP4 // mp4 m3u8
    }
    this.option = Object.assign({}, defaultOption, videoSourceOption)
    this.source_ = null
    switch (this.getType()) {
      case sourceType.MP4:
        this.createSource_()
        break
      case sourceType.M3U8:
        this.createHls_()
        break
      default:
        break
    }
    
  }

  /**
   * @description 生成播放资源
   *
   * @memberof Videopc
   */
  createSource_ () {
    const source = this.source_ = document.createElement('source')
    source.setAttribute('src', this.option.src)
  }

  /**
   * @description 生成HLS资源
   *
   * @memberof VideoSource
   */
  createHls_ () {
    if (Hls.isSupported()) {
      const hls = new Hls()
      hls.loadSource(this.option.src)
      this.source_ = hls
    }
  }

  /**
   * @description 获取资源
   *
   * @returns
   * @memberof VideoSource
   */
  getSource () {
    return this.source_
  }

  /**
   * @description 获取资源类型
   *
   * @returns
   * @memberof VideoSource
   */
  getType () {
    return this.option.type
  }

}
export default VideoSource